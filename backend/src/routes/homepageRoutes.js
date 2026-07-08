const express = require("express");
const router = express.Router();

const {
  getHomepageContent,
  updateHomepageContent,
} = require("../controllers/homepageController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Get homepage content
router.get("/", getHomepageContent);

// Update homepage content
router.put("/", protect, adminOnly, updateHomepageContent);

module.exports = router;