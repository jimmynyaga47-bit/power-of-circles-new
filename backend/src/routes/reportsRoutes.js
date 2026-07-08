const express = require("express");
const router = express.Router();

const {
  getEventReport,
  getCategoryReport,
  getCheckinReport,
} = require("../controllers/reportsController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/events", protect, adminOnly, getEventReport);
router.get("/categories", protect, adminOnly, getCategoryReport);
router.get("/checkins", protect, adminOnly, getCheckinReport);

module.exports = router;
