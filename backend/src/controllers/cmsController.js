const pool = require("../config/db");

// ── WEBSITE SETTINGS (Hero, Contact, Footer, Social) ──
const getWebsiteSettings = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM website_settings WHERE id=1");
    res.json(result.rows[0] || {});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateWebsiteSettings = async (req, res) => {
  try {
    const {
      hero_title, hero_subtitle, hero_button_text, hero_image,
      about_title, about_text,
      contact_email, contact_phone, contact_address,
      facebook, instagram, linkedin, twitter, footer_text
    } = req.body;

    await pool.query(
      `UPDATE website_settings SET
        hero_title=$1, hero_subtitle=$2, hero_button_text=$3, hero_image=$4,
        about_title=$5, about_text=$6,
        contact_email=$7, contact_phone=$8, contact_address=$9,
        facebook=$10, instagram=$11, linkedin=$12, twitter=$13,
        footer_text=$14, updated_at=NOW()
       WHERE id=1`,
      [
        hero_title, hero_subtitle, hero_button_text, hero_image,
        about_title, about_text,
        contact_email, contact_phone, contact_address,
        facebook, instagram, linkedin, twitter, footer_text
      ]
    );
    res.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ── FOUNDERS ──
const getFounders = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cms_founders ORDER BY display_order ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const createFounder = async (req, res) => {
  try {
    const { name, title, bio, quote, photo_url, display_order } = req.body;
    const result = await pool.query(
      `INSERT INTO cms_founders (name, title, bio, quote, photo_url, display_order)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [name, title, bio, quote, photo_url, display_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateFounder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title, bio, quote, photo_url, display_order } = req.body;
    const result = await pool.query(
      `UPDATE cms_founders SET name=$1, title=$2, bio=$3, quote=$4,
       photo_url=$5, display_order=$6 WHERE id=$7 RETURNING *`,
      [name, title, bio, quote, photo_url, display_order || 0, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteFounder = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM cms_founders WHERE id=$1", [id]);
    res.json({ message: "Founder deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── SPONSORS ──
const getSponsors = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cms_sponsors ORDER BY display_order ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const createSponsor = async (req, res) => {
  try {
    const { name, logo_url, website, tier, display_order } = req.body;
    const result = await pool.query(
      `INSERT INTO cms_sponsors (name, logo_url, website, tier, display_order)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, logo_url, website, tier || "General", display_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateSponsor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, logo_url, website, tier, display_order } = req.body;
    const result = await pool.query(
      `UPDATE cms_sponsors SET name=$1, logo_url=$2, website=$3,
       tier=$4, display_order=$5 WHERE id=$6 RETURNING *`,
      [name, logo_url, website, tier, display_order || 0, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteSponsor = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM cms_sponsors WHERE id=$1", [id]);
    res.json({ message: "Sponsor deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── TESTIMONIALS ──
const getTestimonials = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cms_testimonials ORDER BY display_order ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const createTestimonial = async (req, res) => {
  try {
    const { name, role, quote, photo_url, display_order } = req.body;
    const result = await pool.query(
      `INSERT INTO cms_testimonials (name, role, quote, photo_url, display_order)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, role, quote, photo_url, display_order || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, quote, photo_url, display_order } = req.body;
    const result = await pool.query(
      `UPDATE cms_testimonials SET name=$1, role=$2, quote=$3,
       photo_url=$4, display_order=$5 WHERE id=$6 RETURNING *`,
      [name, role, quote, photo_url, display_order || 0, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM cms_testimonials WHERE id=$1", [id]);
    res.json({ message: "Testimonial deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── EVENT PROGRAMS ──
const getPrograms = async (req, res) => {
  try {
    const { event_id } = req.query;
    const result = await pool.query(
      "SELECT * FROM event_programs WHERE event_id=$1 ORDER BY uploaded_at DESC",
      [event_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const uploadProgram = async (req, res) => {
  try {
    const { event_id, title, pdf_url } = req.body;
    const result = await pool.query(
      `INSERT INTO event_programs (event_id, title, pdf_url)
       VALUES ($1,$2,$3) RETURNING *`,
      [event_id, title, pdf_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM event_programs WHERE id=$1", [id]);
    res.json({ message: "Program deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── PROGRAM SUBSCRIPTIONS ──
const subscribeToProgram = async (req, res) => {
  try {
    const { event_id, email, name } = req.body;
    if (!event_id || !email) {
      return res.status(400).json({ message: "Event and email are required" });
    }

    const existing = await pool.query(
      "SELECT * FROM program_subscriptions WHERE event_id=$1 AND email=$2",
      [event_id, email]
    );

    if (existing.rows.length > 0) {
      return res.json({ message: "You are already subscribed to this program" });
    }

    await pool.query(
      "INSERT INTO program_subscriptions (event_id, email, name) VALUES ($1,$2,$3)",
      [event_id, email, name]
    );

    const program = await pool.query(
      "SELECT * FROM event_programs WHERE event_id=$1 ORDER BY uploaded_at DESC LIMIT 1",
      [event_id]
    );

    res.status(201).json({
      message: "Subscribed successfully",
      program: program.rows[0] || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getSubscriptions = async (req, res) => {
  try {
    const { event_id } = req.query;
    const result = await pool.query(
      `SELECT ps.*, e.name as event_name
       FROM program_subscriptions ps
       LEFT JOIN events e ON ps.event_id = e.id
       WHERE ps.event_id=$1
       ORDER BY ps.subscribed_at DESC`,
      [event_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ── GALLERY ──
const getGallery = async (req, res) => {
  try {
    const { event_id } = req.query;
    const result = event_id
      ? await pool.query(
          "SELECT * FROM gallery WHERE event_id=$1 ORDER BY uploaded_at DESC",
          [event_id]
        )
      : await pool.query("SELECT * FROM gallery ORDER BY uploaded_at DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const addGalleryItem = async (req, res) => {
  try {
    const { url, type, caption, event_id } = req.body;
    if (!url) {
      return res.status(400).json({ message: "url is required" });
    }
    const result = await pool.query(
      `INSERT INTO gallery (url, type, caption, event_id)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [url, type || "image", caption || null, event_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM gallery WHERE id=$1", [id]);
    res.json({ message: "Gallery item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getWebsiteSettings, updateWebsiteSettings,
  getFounders, createFounder, updateFounder, deleteFounder,
  getSponsors, createSponsor, updateSponsor, deleteSponsor,
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
  getPrograms, uploadProgram, deleteProgram,
  subscribeToProgram, getSubscriptions,
  getGallery, addGalleryItem, deleteGalleryItem,
};