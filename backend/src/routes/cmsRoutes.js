const express = require("express");
const router = express.Router();
const {
  getWebsiteSettings, updateWebsiteSettings,
  getFounders, createFounder, updateFounder, deleteFounder,
  getSponsors, createSponsor, updateSponsor, deleteSponsor,
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
  getPrograms, uploadProgram, deleteProgram,
  subscribeToProgram, getSubscriptions,
  getGallery, addGalleryItem, deleteGalleryItem,
} = require("../controllers/cmsController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// ── Website Settings ──
router.get("/settings", getWebsiteSettings);
router.put("/settings", protect, adminOnly, updateWebsiteSettings);

// ── Founders ──
router.get("/founders", getFounders);
router.post("/founders", protect, adminOnly, createFounder);
router.put("/founders/:id", protect, adminOnly, updateFounder);
router.delete("/founders/:id", protect, adminOnly, deleteFounder);

// ── Sponsors ──
router.get("/sponsors", getSponsors);
router.post("/sponsors", protect, adminOnly, createSponsor);
router.put("/sponsors/:id", protect, adminOnly, updateSponsor);
router.delete("/sponsors/:id", protect, adminOnly, deleteSponsor);

// ── Testimonials ──
router.get("/testimonials", getTestimonials);
router.post("/testimonials", protect, adminOnly, createTestimonial);
router.put("/testimonials/:id", protect, adminOnly, updateTestimonial);
router.delete("/testimonials/:id", protect, adminOnly, deleteTestimonial);

// ── Event Programs ──
router.get("/programs", getPrograms);
router.post("/programs", protect, adminOnly, uploadProgram);
router.delete("/programs/:id", protect, adminOnly, deleteProgram);

// ── Program Subscriptions ──
router.post("/subscribe", subscribeToProgram);
router.get("/subscriptions", protect, adminOnly, getSubscriptions);

// ── Gallery ──
router.get("/gallery", getGallery);
router.post("/gallery", protect, adminOnly, addGalleryItem);
router.delete("/gallery/:id", protect, adminOnly, deleteGalleryItem);

module.exports = router;