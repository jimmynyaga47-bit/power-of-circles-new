const pool = require("../config/db");
const sendEmail = require("../utils/sendEmail");

// Public: submit contact form
const submitMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email and message are required" });
    }

    const result = await pool.query(
      `INSERT INTO contact_messages (name, email, phone, subject, message)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, email, phone || null, subject || null, message]
    );

    // Notify admin inbox (configured contact_email, falling back to EMAIL_USER)
    try {
      const settings = await pool.query(
        "SELECT contact_email FROM website_settings LIMIT 1"
      );
      const notifyTo = settings.rows[0]?.contact_email || process.env.EMAIL_USER;

      if (notifyTo) {
        await sendEmail({
          email: notifyTo,
          subject: `New Contact Message: ${subject || "General Enquiry"}`,
          html: `
            <div style="font-family:Arial,sans-serif;padding:20px;">
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || "—"}</p>
              <p><strong>Subject:</strong> ${subject || "—"}</p>
              <p><strong>Message:</strong></p>
              <p>${message}</p>
            </div>
          `,
        });
      }
    } catch (emailErr) {
      console.error("Contact notification email failed:", emailErr.message);
    }

    res.status(201).json({
      message: "Message sent successfully! We'll get back to you within 24 hours.",
      contactMessage: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: list messages
const getMessages = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM contact_messages ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: mark as read/handled
const markMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      "UPDATE contact_messages SET status=$1 WHERE id=$2 RETURNING *",
      [status || "read", id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({ message: "Status updated", contactMessage: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { submitMessage, getMessages, markMessageStatus };