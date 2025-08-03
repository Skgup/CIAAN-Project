// routes/uploadRoutes.js
import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/cover", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "File upload failed" });
    }
    // ✅ Return the Cloudinary URL
    return res.status(200).json({ imageUrl: req.file.path });
  } catch (err) {
    console.error("❌ Cover upload error:", err);
    return res.status(500).json({ error: err.message });
  }
});

router.post("/profile", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "File upload failed" });
    }
    return res.status(200).json({ imageUrl: req.file.path });
  } catch (err) {
    console.error("❌ Profile upload error:", err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
