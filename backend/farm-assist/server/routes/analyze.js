// backend/routes/analyze.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const data = require("../data/rules.json");
const { analyzeImageWithGemini } = require("../services/geminiVision");

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No image uploaded" });
  }

  const imagePath = path.join(__dirname, "../", req.file.path);

  try {
    // Read image
    const imageBuffer = fs.readFileSync(imagePath);
    let imageBase64 = imageBuffer.toString("base64");

    // Call Gemini
    const aiResponse = await analyzeImageWithGemini(imageBase64);
    console.log("🧠 Raw AI Response:", aiResponse.analysis);

    // Default fallback structure
    let structuredResult = {
      disease: "Not detected",
      risk: "Unknown",
      actions: [],
      warning: "AI analysis unavailable."
    };

    try {
      // 🔥 CLEAN MARKDOWN JSON
      let cleaned = aiResponse.analysis
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      structuredResult = JSON.parse(cleaned);
    } catch (parseErr) {
      console.warn("⚠️ JSON parse failed. Sending raw text.");
      structuredResult.warning = aiResponse.analysis;
    }

    console.log("✅ Final structured result:", structuredResult);

    res.json({
      success: true,
      analysis: structuredResult
    });

  } catch (err) {
    console.error("❌ Error analyzing image:", err);

    res.status(500).json({
      success: false,
      error: err.message,
      fallback: data
    });
  } finally {
    fs.unlink(imagePath, () => {});
  }
});

module.exports = router;
