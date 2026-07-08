const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
require("./config/db");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://powerofcirclesinnetworking.com",
    "https://www.powerofcirclesinnetworking.com",
  ],
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// Static file serving (uploads: images, banners, CSV imports, etc.)
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Routes
const authRoutes = require("./routes/authRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const ticketsRoutes = require("./routes/tickets");
const settingsRoutes = require("./routes/settingsRoutes");
const cmsRoutes = require("./routes/cmsRoutes");
const adminRequestRoutes = require("./routes/adminRequestRoutes");
const adminRoutes = require("./routes/adminRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const homepageRoutes = require("./routes/homepageRoutes");
const verifyRoutes = require("./routes/verifyRoutes");
const reportsRoutes = require("./routes/reportsRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/tickets", ticketsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/cms", cmsRoutes);
app.use("/api/admin-requests", adminRequestRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/homepage", homepageRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/reports", reportsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Power of Circles API is running!", status: "success" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;