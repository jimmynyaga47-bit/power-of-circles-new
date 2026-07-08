const express = require("express");
const router = express.Router();

const { verifyTicket } = require("../controllers/verifyController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

// Verify by Ticket Number OR QR Code
router.post(
  "/",
  protect,
  adminOnly,
  verifyTicket
);

module.exports = router;