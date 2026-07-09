const path = require("path");

// Returns the absolute URL to the uploaded file, ready to be stored
// directly in fields like hero_image, gallery.url, etc.
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/cms/${req.file.filename}`;

  res.status(201).json({
    message: "File uploaded successfully",
    url: fileUrl,
    filename: req.file.filename,
  });
};

module.exports = { uploadImage };