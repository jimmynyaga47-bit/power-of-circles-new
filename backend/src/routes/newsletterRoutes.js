const express = require("express");
const router = express.Router();

const { subscribe, getSubscribers } = require("../controllers/newsletterController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/subscribe", subscribe);
router.get("/", protect, adminOnly, getSubscribers);

module.exports = router;