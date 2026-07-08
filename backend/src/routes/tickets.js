const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const {
  getTicketTypes,
  addTicketType,
} = require("../controllers/eventsController");

const {
  createTicket,
  createManualTicket,
  bulkCreateTickets,
  getTickets,
  getTicket,
  cancelTicket,
  upgradeTicket,
  regenerateQrCode,
  downloadTicketPdf,
  resendTicket,
} = require("../controllers/ticketsController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// --------------------
// Ticket Types (public read, admin write)
// --------------------

router.get("/event/:id", getTicketTypes);
router.post("/event/:id", protect, adminOnly, addTicketType);

// --------------------
// Ticket Purchase (public)
// --------------------

router.post("/purchase", createTicket);

// --------------------
// Admin Ticket Management (all protected)
// --------------------

router.get("/", protect, adminOnly, getTickets);

router.post("/manual", protect, adminOnly, createManualTicket);
router.post("/bulk-upload", protect, adminOnly, upload.single("file"), bulkCreateTickets);

router.get("/:id", protect, adminOnly, getTicket);
router.get("/:id/pdf", protect, adminOnly, downloadTicketPdf);

router.put("/:id/cancel", protect, adminOnly, cancelTicket);
router.put("/:id/upgrade", protect, adminOnly, upgradeTicket);

router.post("/:id/resend", protect, adminOnly, resendTicket);
router.post("/:id/qr-regenerate", protect, adminOnly, regenerateQrCode);

module.exports = router;
