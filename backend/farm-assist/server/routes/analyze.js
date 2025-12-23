// server/routes/analyze.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const { analyzeImageWithGemini } = require("../services/geminiVision");

const upload = multer({ dest: "uploads/" });

/* -------------------- NORMALIZATION -------------------- */
function normalizeCrop(crop) {
  if (!crop) return "Unknown";

  const c = crop.toLowerCase();

  if (c.includes("maize") || c.includes("corn")) return "corn";
  if (c.includes("rice") || c.includes("paddy")) return "rice";
  if (c.includes("wheat")) return "wheat";
  if (c.includes("tomato")) return "tomato";

  return "Unknown";
}

/* -------------------- DOMAIN KNOWLEDGE -------------------- */
const HIGH_RISK_DISEASES = [
  "corn smut",
  "late blight",
  "bacterial wilt",
  "panama disease",
  "wheat rust"
];

const DISEASE_WARNINGS = {
  "corn smut":
    "Galls can eventually burst, releasing millions of dark spores that can persist in the soil for several years and spread via wind."
};

const SUPPORTED_CROPS = [
  "tomato",
  "rice",
  "wheat",
  "corn",
  "potato",
  "cotton",
  "sugarcane",
  "Unknown"
];

/* -------------------- ROUTE -------------------- */
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

    const aiResponse = await analyzeImageWithGemini(imageBase64);

    if (aiResponse.status === "RATE_LIMITED") {
      return res.status(429).json({
        success: false,
        error: "Daily AI usage limit reached. Please try again later."
      });
    }

    if (aiResponse.status !== "OK") {
      return res.status(500).json({
        success: false,
        error: "AI analysis failed. Please try again."
      });
    }

    let result;
    try {
      const cleaned = aiResponse.analysis
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      result = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({
        success: false,
        error: "AI returned an invalid response."
      });
    }

    /* -------------------- VALIDATION -------------------- */
    if (result.isPlant !== true) {
      return res.status(400).json({
        success: false,
        error: "Invalid image. Please upload a crop image."
      });
    }

    /* -------------------- NORMALIZE CROP -------------------- */
    result.crop = normalizeCrop(result.crop);

    /* -------------------- RISK OVERRIDE -------------------- */
    if (
      result.disease &&
      HIGH_RISK_DISEASES.includes(result.disease.toLowerCase())
    ) {
      result.risk = "High";
    }

    /* -------------------- WARNING INJECTION -------------------- */
    if (!result.warning || result.warning === "None") {
      const key = result.disease?.toLowerCase();
      if (DISEASE_WARNINGS[key]) {
        result.warning = DISEASE_WARNINGS[key];
      }
    }

    /* -------------------- SUPPORT CHECK (NON-BLOCKING) -------------------- */
    if (!SUPPORTED_CROPS.includes(result.crop)) {
      result.warning =
        result.warning ||
        "Crop detected but full advisory support may be limited.";
    }

    /* -------------------- SUCCESS -------------------- */
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
    if (imagePath) {
      fs.unlink(imagePath, () => {});
    }
  }
});

module.exports = router;
