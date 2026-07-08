const pool = require("../config/db");
const sendEmail = require("../utils/sendEmail");
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");
const XLSX = require("xlsx");

// Categories supported across the Ticket Centre / Complimentary Tickets system
const TICKET_CATEGORIES = ["paid", "complimentary", "vip", "staff", "media", "speaker"];
const CATEGORY_LABELS = {
  paid: "Paid",
  complimentary: "Complimentary",
  vip: "VIP Invitation",
  staff: "Staff",
  media: "Media",
  speaker: "Speaker",
};

const normalizeCategory = (category) => {
  const value = (category || "paid").toString().toLowerCase().trim();
  return TICKET_CATEGORIES.includes(value) ? value : "paid";
};

const generateTicketNumber = () =>
  `POC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// Generates a QR code (as a base64 data URL) encoding the ticket number,
// used both for storage in the DB and for embedding/attaching to emails.
const generateQrCode = async (ticketNumber) => {
  return QRCode.toDataURL(ticketNumber, { margin: 1, width: 300 });
};

const qrDataUrlToBuffer = (dataUrl) => {
  const base64 = dataUrl.split(",")[1];
  return Buffer.from(base64, "base64");
};

const ticketEmailHtml = ({ heading, customer_name, ticket_number, event_name, ticket_type, price, note }) => `
  <div style="font-family:Arial,sans-serif;padding:24px;max-width:520px;margin:0 auto;">
    <h2 style="color:#1d4ed8;margin-bottom:4px;">${heading}</h2>
    <p>Hello ${customer_name || "there"},</p>
    <p><strong>Ticket Number:</strong> ${ticket_number}</p>
    ${event_name ? `<p><strong>Event:</strong> ${event_name}</p>` : ""}
    ${ticket_type ? `<p><strong>Ticket Type:</strong> ${ticket_type}</p>` : ""}
    ${price !== undefined ? `<p><strong>Price:</strong> KSh ${price}</p>` : ""}
    ${note ? `<p>${note}</p>` : ""}
    <hr style="margin:20px 0;border:none;border-top:1px solid #e5e7eb;" />
    <p>Please present the QR code below (also attached) at the entrance for check-in.</p>
    <div style="text-align:center;margin-top:16px;">
      <img src="cid:ticketqr" alt="Ticket QR Code" style="width:200px;height:200px;" />
    </div>
    <div style="padding:15px;background:#f3f4f6;margin-top:20px;text-align:center;border-radius:8px;">
      <strong>${ticket_number}</strong>
    </div>
  </div>
`;

const buildQrAttachment = (qrDataUrl) => ({
  filename: "ticket-qr.png",
  content: qrDataUrlToBuffer(qrDataUrl),
  cid: "ticketqr",
});

// ============================
// PUBLIC: Purchase Ticket
// ============================
const createTicket = async (req, res) => {
  try {
    const { event_id, ticket_type_id, customer_name, email, phone } = req.body;

    if (!event_id || !ticket_type_id || !customer_name || !email) {
      return res.status(400).json({ message: "Missing required ticket fields" });
    }

    const ticketType = await pool.query(
      "SELECT * FROM ticket_types WHERE id = $1",
      [ticket_type_id]
    );

    if (ticketType.rows.length === 0) {
      return res.status(404).json({ message: "Ticket type not found" });
    }

    const ticketData = ticketType.rows[0];
    const ticket_number = generateTicketNumber();
    const qr_code = await generateQrCode(ticket_number);

    const newTicket = await pool.query(
      `INSERT INTO tickets
        (ticket_number, event_id, ticket_type_id, customer_name, email, phone, status, category, qr_code)
       VALUES ($1,$2,$3,$4,$5,$6,'paid','paid',$7)
       RETURNING *`,
      [ticket_number, event_id, ticket_type_id, customer_name, email, phone, qr_code]
    );

    const ticket = newTicket.rows[0];

    try {
      await sendEmail({
        email,
        subject: "🎫 Your Power Of Circles Ticket",
        html: ticketEmailHtml({
          heading: "Ticket Confirmed 🎉",
          customer_name,
          ticket_number,
          price: ticketData.price,
          note: "Thank you for your purchase!",
        }),
        attachments: [buildQrAttachment(qr_code)],
      });
    } catch (emailErr) {
      console.error("Ticket email failed:", emailErr.message);
    }

    return res.status(201).json({
      message: "Ticket purchased successfully",
      ticket,
    });
  } catch (error) {
    console.error("Ticket Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ============================
// ADMIN: Manual Ticket Creation (supports categories)
// ============================
const createManualTicket = async (req, res) => {
  try {
    const {
      event_id,
      ticket_type_id,
      customer_name,
      email,
      phone,
      category,
    } = req.body;

    if (!event_id || !ticket_type_id || !customer_name || !email) {
      return res.status(400).json({ message: "Missing required ticket fields" });
    }

    const ticketType = await pool.query(
      "SELECT * FROM ticket_types WHERE id = $1",
      [ticket_type_id]
    );

    if (ticketType.rows.length === 0) {
      return res.status(404).json({ message: "Ticket type not found" });
    }

    const ticketData = ticketType.rows[0];
    const normalizedCategory = normalizeCategory(category);
    const status = normalizedCategory === "paid" ? "paid" : "issued";
    const ticket_number = generateTicketNumber();
    const qr_code = await generateQrCode(ticket_number);

    const newTicket = await pool.query(
      `INSERT INTO tickets
        (ticket_number, event_id, ticket_type_id, customer_name, email, phone, status, category, qr_code, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [
        ticket_number,
        event_id,
        ticket_type_id,
        customer_name,
        email,
        phone,
        status,
        normalizedCategory,
        qr_code,
        req.user?.id || null,
      ]
    );

    const ticket = newTicket.rows[0];

    try {
      await sendEmail({
        email,
        subject: `🎫 Your ${CATEGORY_LABELS[normalizedCategory]} Ticket - Power Of Circles`,
        html: ticketEmailHtml({
          heading: `${CATEGORY_LABELS[normalizedCategory]} Ticket Issued`,
          customer_name,
          ticket_number,
          price: normalizedCategory === "paid" ? ticketData.price : undefined,
          note:
            normalizedCategory === "paid"
              ? "This ticket was issued manually by our team."
              : `You have been issued a complimentary (${CATEGORY_LABELS[normalizedCategory]}) ticket. No payment is required.`,
        }),
        attachments: [buildQrAttachment(qr_code)],
      });
    } catch (emailErr) {
      console.error("Manual ticket email failed:", emailErr.message);
    }

    return res.status(201).json({
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    console.error("Manual Ticket Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ============================
// ADMIN: Bulk Ticket Creation via CSV/Excel
// Expected columns: event_id, ticket_type_id, customer_name, email, phone, category
// ============================
const bulkCreateTickets = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: "",
    });

    if (rows.length === 0) {
      return res.status(400).json({ message: "The uploaded file has no rows" });
    }

    const created = [];
    const failed = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const event_id = row.event_id || row.Event || row.event;
        const ticket_type_id = row.ticket_type_id || row.TicketType || row.ticket_type;
        const customer_name = row.customer_name || row.Name || row.name;
        const email = row.email || row.Email;
        const phone = row.phone || row.Phone || "";
        const category = normalizeCategory(row.category || row.Category);

        if (!event_id || !ticket_type_id || !customer_name || !email) {
          failed.push({ row: i + 2, reason: "Missing required fields" });
          continue;
        }

        const ticketType = await pool.query(
          "SELECT * FROM ticket_types WHERE id = $1",
          [ticket_type_id]
        );

        if (ticketType.rows.length === 0) {
          failed.push({ row: i + 2, reason: "Ticket type not found" });
          continue;
        }

        const status = category === "paid" ? "paid" : "issued";
        const ticket_number = generateTicketNumber();
        const qr_code = await generateQrCode(ticket_number);

        const result = await pool.query(
          `INSERT INTO tickets
            (ticket_number, event_id, ticket_type_id, customer_name, email, phone, status, category, qr_code, created_by)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
           RETURNING *`,
          [
            ticket_number,
            event_id,
            ticket_type_id,
            customer_name,
            email,
            phone,
            status,
            category,
            qr_code,
            req.user?.id || null,
          ]
        );

        created.push(result.rows[0]);

        sendEmail({
          email,
          subject: `🎫 Your ${CATEGORY_LABELS[category]} Ticket - Power Of Circles`,
          html: ticketEmailHtml({
            heading: `${CATEGORY_LABELS[category]} Ticket Issued`,
            customer_name,
            ticket_number,
            note: "This ticket was issued as part of a bulk upload.",
          }),
          attachments: [buildQrAttachment(qr_code)],
        }).catch((e) => console.error("Bulk ticket email failed:", e.message));
      } catch (rowErr) {
        console.error(rowErr);
        failed.push({ row: i + 2, reason: "Server error while processing row" });
      }
    }

    return res.status(201).json({
      message: `Bulk upload complete. ${created.length} ticket(s) created, ${failed.length} failed.`,
      created: created.length,
      failed,
    });
  } catch (error) {
    console.error("Bulk Upload Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ============================
// ADMIN: Get all tickets (search, filter, pagination)
// ============================
const getTickets = async (req, res) => {
  try {
    const {
      search = "",
      category,
      status,
      event_id,
      page = 1,
      limit = 25,
    } = req.query;

    const conditions = [];
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      const idx = params.length;
      conditions.push(
        `(t.customer_name ILIKE $${idx} OR t.email ILIKE $${idx} OR t.ticket_number ILIKE $${idx} OR e.name ILIKE $${idx})`
      );
    }

    if (category) {
      params.push(category);
      conditions.push(`t.category = $${params.length}`);
    }

    if (status) {
      params.push(status);
      conditions.push(`t.status = $${params.length}`);
    }

    if (event_id) {
      params.push(event_id);
      conditions.push(`t.event_id = $${params.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM tickets t JOIN events e ON t.event_id = e.id ${whereClause}`,
      params
    );

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 25, 1), 200);
    const offset = (pageNum - 1) * limitNum;

    params.push(limitNum);
    params.push(offset);

    const tickets = await pool.query(
      `
      SELECT
        t.*,
        e.name AS event_name,
        tt.name AS ticket_type,
        tt.price
      FROM tickets t
      JOIN events e ON t.event_id = e.id
      JOIN ticket_types tt ON t.ticket_type_id = tt.id
      ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
      `,
      params
    );

    return res.json({
      tickets: tickets.rows,
      total: Number(countResult.rows[0].count),
      page: pageNum,
      limit: limitNum,
      totalPages: Math.max(Math.ceil(Number(countResult.rows[0].count) / limitNum), 1),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🔍 Get one ticket
const getTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await pool.query(
      `
      SELECT
        t.*,
        e.name AS event_name,
        tt.name AS ticket_type,
        tt.price
      FROM tickets t
      JOIN events e ON t.event_id = e.id
      JOIN ticket_types tt ON t.ticket_type_id = tt.id
      WHERE t.id = $1
      `,
      [id]
    );

    if (ticket.rows.length === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.json({ ticket: ticket.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Cancel Ticket
const cancelTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE tickets SET status='cancelled', updated_at=NOW() WHERE id=$1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({ message: "Ticket cancelled successfully", ticket: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Upgrade / Downgrade Ticket (change ticket type within the same event)
const upgradeTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { ticket_type_id } = req.body;

    if (!ticket_type_id) {
      return res.status(400).json({ message: "ticket_type_id is required" });
    }

    const existing = await pool.query("SELECT * FROM tickets WHERE id=$1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const newType = await pool.query(
      "SELECT * FROM ticket_types WHERE id=$1 AND event_id=$2",
      [ticket_type_id, existing.rows[0].event_id]
    );

    if (newType.rows.length === 0) {
      return res.status(404).json({
        message: "Selected ticket type does not belong to this event",
      });
    }

    const updated = await pool.query(
      `UPDATE tickets SET ticket_type_id=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
      [ticket_type_id, id]
    );

    const ticket = updated.rows[0];
    const eventRow = await pool.query("SELECT name FROM events WHERE id=$1", [ticket.event_id]);

    try {
      await sendEmail({
        email: ticket.email,
        subject: "Your Power Of Circles Ticket Was Updated",
        html: ticketEmailHtml({
          heading: "Ticket Updated",
          customer_name: ticket.customer_name,
          ticket_number: ticket.ticket_number,
          event_name: eventRow.rows[0]?.name,
          ticket_type: newType.rows[0].name,
          price: newType.rows[0].price,
          note: "Your ticket type has been changed by our team.",
        }),
        attachments: [buildQrAttachment(ticket.qr_code || (await generateQrCode(ticket.ticket_number)))],
      });
    } catch (emailErr) {
      console.error("Upgrade email failed:", emailErr.message);
    }

    res.json({ message: "Ticket updated successfully", ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Regenerate QR Code
const regenerateQrCode = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT t.*, e.name AS event_name FROM tickets t JOIN events e ON e.id=t.event_id WHERE t.id=$1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const ticket = result.rows[0];
    const qr_code = await generateQrCode(ticket.ticket_number);

    await pool.query("UPDATE tickets SET qr_code=$1, updated_at=NOW() WHERE id=$2", [
      qr_code,
      id,
    ]);

    try {
      await sendEmail({
        email: ticket.email,
        subject: "Your Power Of Circles QR Code",
        html: ticketEmailHtml({
          heading: "New QR Code Generated",
          customer_name: ticket.customer_name,
          ticket_number: ticket.ticket_number,
          event_name: ticket.event_name,
          note: "A new QR code has been generated for your ticket. Please use this one at the entrance.",
        }),
        attachments: [buildQrAttachment(qr_code)],
      });
    } catch (emailErr) {
      console.error("QR email failed:", emailErr.message);
    }

    res.json({ message: "QR code regenerated and emailed", qr_code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Download Ticket as PDF
const downloadTicketPdf = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT t.*, e.name AS event_name, e.venue, e.date, e.time, tt.name AS ticket_type, tt.price
      FROM tickets t
      JOIN events e ON e.id=t.event_id
      JOIN ticket_types tt ON tt.id=t.ticket_type_id
      WHERE t.id=$1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const ticket = result.rows[0];
    const qrDataUrl = ticket.qr_code || (await generateQrCode(ticket.ticket_number));
    const qrBuffer = qrDataUrlToBuffer(qrDataUrl);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="ticket-${ticket.ticket_number}.pdf"`
    );

    const doc = new PDFDocument({ size: "A5", margin: 40 });
    doc.pipe(res);

    doc.fontSize(20).fillColor("#1d4ed8").text("Power Of Circles", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(14).fillColor("#111827").text(ticket.event_name, { align: "center" });
    doc.moveDown(1);

    doc.fontSize(11).fillColor("#374151");
    doc.text(`Ticket Number: ${ticket.ticket_number}`);
    doc.text(`Customer: ${ticket.customer_name}`);
    doc.text(`Email: ${ticket.email}`);
    if (ticket.phone) doc.text(`Phone: ${ticket.phone}`);
    doc.text(`Ticket Type: ${ticket.ticket_type}`);
    doc.text(`Category: ${CATEGORY_LABELS[ticket.category] || "Paid"}`);
    doc.text(`Price: KSh ${ticket.price}`);
    doc.text(`Status: ${ticket.status}`);
    if (ticket.venue) doc.text(`Venue: ${ticket.venue}`);
    if (ticket.date) doc.text(`Date: ${new Date(ticket.date).toLocaleDateString()}`);
    if (ticket.time) doc.text(`Time: ${ticket.time}`);

    doc.moveDown(1);
    doc.image(qrBuffer, { fit: [180, 180], align: "center" });

    doc.moveDown(1);
    doc
      .fontSize(9)
      .fillColor("#6b7280")
      .text("Please present this ticket (printed or on your phone) at the entrance.", {
        align: "center",
      });

    doc.end();
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Server Error" });
    }
  }
};

// Resend Ticket Email
const resendTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT t.*, tt.price, tt.name AS ticket_type, e.name AS event_name
      FROM tickets t
      JOIN ticket_types tt ON tt.id=t.ticket_type_id
      JOIN events e ON e.id=t.event_id
      WHERE t.id=$1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const ticket = result.rows[0];
    const qrDataUrl = ticket.qr_code || (await generateQrCode(ticket.ticket_number));

    if (!ticket.qr_code) {
      await pool.query("UPDATE tickets SET qr_code=$1 WHERE id=$2", [qrDataUrl, id]);
    }

    await sendEmail({
      email: ticket.email,
      subject: "Your Power Of Circles Ticket (Resent)",
      html: ticketEmailHtml({
        heading: "Here's Your Ticket Again",
        customer_name: ticket.customer_name,
        ticket_number: ticket.ticket_number,
        event_name: ticket.event_name,
        ticket_type: ticket.ticket_type,
        price: ticket.price,
        note: "Thank you for being part of Power Of Circles.",
      }),
      attachments: [buildQrAttachment(qrDataUrl)],
    });

    res.json({ message: "Ticket resent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  TICKET_CATEGORIES,
  CATEGORY_LABELS,
  createTicket,
  createManualTicket,
  bulkCreateTickets,
  getTickets,
  getTicket,
  cancelTicket,
  upgradeTicket,
  regenerateQrCode,
  downloadTicketPdf,
  resendTicket,
};
