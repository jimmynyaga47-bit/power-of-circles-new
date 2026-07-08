const express = require("express");
const router = express.Router();

const {
  submitRequest,
  getRequests,
  approveRequest,
  rejectRequest,
} = require("../controllers/adminRequestController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public — anyone can submit a request
router.post("/", submitRequest);

// Admin only
router.get("/", protect, adminOnly, getRequests);
router.put("/:id/approve", protect, adminOnly, approveRequest);
router.put("/:id/reject", protect, adminOnly, rejectRequest);

module.exports = router;