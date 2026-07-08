const express = require("express");

const router = express.Router();

const {
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

router.get(
  "/",
  protect,
  adminOnly,
  getSettings
);

router.put(
  "/",
  protect,
  adminOnly,
  updateSettings
);

module.exports = router;