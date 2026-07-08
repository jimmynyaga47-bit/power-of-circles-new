const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Get all users
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT id, name, email, role_id, approved, is_active FROM users"
    );

    res.json(users.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Approve admin
router.put("/approve/:id", protect, adminOnly, async (req, res) => {
  try {
    await pool.query(
      "UPDATE users SET approved = TRUE WHERE id = $1",
      [req.params.id]
    );

    res.json({ message: "User approved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Activate/Deactivate user
router.put("/toggle/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT is_active FROM users WHERE id = $1",
      [req.params.id]
    );

    const newStatus = !user.rows[0].is_active;

    await pool.query(
      "UPDATE users SET is_active = $1 WHERE id = $2",
      [newStatus, req.params.id]
    );

    res.json({ message: "User status updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;