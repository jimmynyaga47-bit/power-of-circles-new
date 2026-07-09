const express = require("express");
const router = express.Router();

const {
  submitMessage,
  getMessages,
  markMessageStatus,
} = require("../controllers/contactController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", submitMessage);
router.get("/", protect, adminOnly, getMessages);
router.put("/:id/status", protect, adminOnly, markMessageStatus);

module.exports = router;