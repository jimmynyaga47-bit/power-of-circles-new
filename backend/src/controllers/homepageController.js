const pool = require("../config/db");

// Get homepage content
const getHomepageContent = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM homepage_content LIMIT 1"
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Update homepage content
const updateHomepageContent = async (req, res) => {
  try {
    const {
      hero_title,
      hero_subtitle,
      hero_button_text,
      hero_button_link,
      hero_image,
      welcome_title,
      welcome_message,
      about_title,
      about_text,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE homepage_content
      SET
      hero_title=$1,
      hero_subtitle=$2,
      hero_button_text=$3,
      hero_button_link=$4,
      hero_image=$5,
      welcome_title=$6,
      welcome_message=$7,
      about_title=$8,
      about_text=$9,
      updated_at=NOW()
      WHERE id=1
      RETURNING *
      `,
      [
        hero_title,
        hero_subtitle,
        hero_button_text,
        hero_button_link,
        hero_image,
        welcome_title,
        welcome_message,
        about_title,
        about_text,
      ]
    );

    res.json({
      message: "Homepage updated successfully",
      homepage: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getHomepageContent,
  updateHomepageContent,
};