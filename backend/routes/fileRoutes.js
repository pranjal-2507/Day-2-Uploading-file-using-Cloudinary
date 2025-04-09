// routes/fileRoutes.js
const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const dataUri = require("../utils/dataUri");
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const file = dataUri(req.file);
    const result = await cloudinary.uploader.upload(file.content);
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
