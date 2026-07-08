const pool = require("../config/db");

// Public: subscribe to newsletter
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    const existing = await pool.query(
      "SELECT id FROM newsletter_subscribers WHERE email=$1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(200).json({ message: "You're already subscribed!" });
    }

    await pool.query(
      "INSERT INTO newsletter_subscribers (email) VALUES ($1)",
      [email]
    );

    res.status(201).json({ message: "Subscribed successfully! Thank you." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: view all subscribers
const getSubscribers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { subscribe, getSubscribers };