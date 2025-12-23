// server/routes/analyze.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const { analyzeImageWithGemini } = require("../services/geminiVision");

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: "No image uploaded"
    });
  }

  let imagePath = req.file.path;

  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString("base64");

    // 🔹 SINGLE GEMINI CALL
    const aiResponse = await analyzeImageWithGemini(imageBase64);

    // 🔹 QUOTA HANDLING
    if (aiResponse.status === "RATE_LIMITED") {
      return res.status(429).json({
        success: false,
        error: "Daily AI usage limit reached. Please try again later."
      });
    }

    // 🔹 AI FAILURE (not quota)
    if (aiResponse.status !== "OK") {
      return res.status(500).json({
        success: false,
        error: "AI analysis failed. Please try again."
      });
    }

    // 🔹 SAFE JSON PARSE
    let result;
    try {
      const cleaned = aiResponse.analysis
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      result = JSON.parse(cleaned);
    } catch (err) {
      console.error("❌ Invalid AI JSON:", aiResponse.analysis);
      return res.status(500).json({
        success: false,
        error: "AI returned an invalid response."
      });
    }

    // 🔹 DOMAIN VALIDATION
    if (result.isPlant !== true) {
      return res.status(400).json({
        success: false,
        error: "Invalid image. Please upload a crop leaf."
      });
    }

    // 🔹 HARD CROP VALIDATION
    const allowedCrops = ["tomato", "rice", "wheat"];
    if (
      !result.crop ||
      !allowedCrops.includes(result.crop.toLowerCase())
    ) {
      return res.status(400).json({
        success: false,
        error: "Unsupported or invalid crop detected."
      });
    }

    // 🔹 SUCCESS
    return res.status(200).json({
      success: true,
      analysis: result
    });

  } catch (err) {
    console.error("❌ Analyze route error:", err);
    return res.status(500).json({
      success: false,
      error: "Server error while analyzing image."
    });
  } finally {
    // 🔹 ALWAYS CLEAN UP FILE
    if (imagePath) {
      fs.unlink(imagePath, () => {});
    }
  }
});

module.exports = router;
