const pool = require("../config/db");

// Submit Request
const submitRequest = async (req, res) => {
  try {
    const { full_name, email, phone, reason } = req.body;

    const existing = await pool.query(
      "SELECT * FROM admin_requests WHERE email=$1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Request already submitted for this email" });
    }

    const request = await pool.query(
      `INSERT INTO admin_requests (full_name, email, phone, reason)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [full_name, email, phone, reason]
    );

    res.status(201).json({ message: "Request submitted", request: request.rows[0] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all requests
const getRequests = async (req, res) => {
  try {
    const requests = await pool.query(
      "SELECT * FROM admin_requests ORDER BY created_at DESC"
    );
    res.json(requests.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Approve request → create user account
const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await pool.query(
      "SELECT * FROM admin_requests WHERE id=$1",
      [id]
    );

    if (request.rows.length === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    const r = request.rows[0];

    // Check if user already exists
    const existing = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [r.email]
    );

    if (existing.rows.length === 0) {
      const bcrypt = require("bcryptjs");
      const tempPassword = "Welcome@2026";
      const hash = await bcrypt.hash(tempPassword, 10);

      await pool.query(
        `INSERT INTO users (name, email, password_hash, role_id, approved)
         VALUES ($1,$2,$3,2,true)`,
        [r.full_name, r.email, hash]
      );
    }

    // Update request status
    await pool.query(
      "UPDATE admin_requests SET status='approved' WHERE id=$1",
      [id]
    );

    res.json({ message: "Request approved. User account created with password: Welcome@2026" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Reject request
const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "UPDATE admin_requests SET status='rejected' WHERE id=$1",
      [id]
    );

    res.json({ message: "Request rejected" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  submitRequest,
  getRequests,
  approveRequest,
  rejectRequest,
};