const pool = require("../config/db");

// Verify by Ticket Number OR QR Code
const verifyTicket = async (req, res) => {
  try {
    const { ticket_number, qr_code } = req.body;

    let result;

    if (ticket_number) {
      result = await pool.query(
        `
        SELECT
          t.*,
          e.name AS event_name,
          tt.name AS ticket_type,
          tt.price
        FROM tickets t
        JOIN events e ON e.id=t.event_id
        JOIN ticket_types tt ON tt.id=t.ticket_type_id
        WHERE t.ticket_number=$1
        `,
        [ticket_number]
      );
    } else if (qr_code) {
      result = await pool.query(
        `
        SELECT
          t.*,
          e.name AS event_name,
          tt.name AS ticket_type,
          tt.price
        FROM tickets t
        JOIN events e ON e.id=t.event_id
        JOIN ticket_types tt ON tt.id=t.ticket_type_id
        WHERE t.qr_code=$1
        `,
        [qr_code]
      );
    } else {
      return res.status(400).json({
        message: "Ticket number or QR code required",
      });
    }

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    const ticket = result.rows[0];

    if (ticket.status === "checked_in") {
      return res.status(400).json({
        message: "Ticket already checked in",
      });
    }

    await pool.query(
      `
      UPDATE tickets
      SET status='checked_in'
      WHERE id=$1
      `,
      [ticket.id]
    );

    await pool.query(
      `
      INSERT INTO check_ins
      (ticket_id, scanned_by, scanned_at, is_valid)
      VALUES($1,$2,NOW(),TRUE)
      `,
      [ticket.id, req.user.id]
    );

    res.json({
      message: "Ticket verified successfully",
      ticket: {
        ticket_number: ticket.ticket_number,
        customer_name: ticket.customer_name,
        event_name: ticket.event_name,
        ticket_type: ticket.ticket_type,
        price: ticket.price,
        email: ticket.email,
        phone: ticket.phone,
      },
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Verification failed",
    });
  }
};

module.exports = {
  verifyTicket,
};