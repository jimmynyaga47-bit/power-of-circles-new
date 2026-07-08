const pool = require("../config/db");

// Get all settings
const getSettings = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT key, value FROM settings"
    );

    const settings = {};

    result.rows.forEach((row) => {
      settings[row.key] = row.value;
    });

    res.json(settings);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error"
    });
  }
};

// Update settings
const updateSettings = async (req, res) => {
  try {

    const data = req.body;

    for (const key in data) {

      await pool.query(
        `
        INSERT INTO settings(key,value)
        VALUES($1,$2)

        ON CONFLICT(key)
        DO UPDATE SET value = EXCLUDED.value,
        updated_at = NOW()
        `,
        [key, data[key]]
      );

    }

    res.json({
      message: "Settings updated successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};