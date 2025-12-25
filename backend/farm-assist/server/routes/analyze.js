// server/routes/analyze.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const { analyzeImageWithGemini } = require("../services/geminiVision");
const GOVT_ADVISORY = require("../data/govtAdvisoryQuick");

const upload = multer({ dest: "uploads/" });

/* -------------------- NORMALIZATION -------------------- */
function normalizeCrop(crop) {
  if (!crop) return "Unknown";

  const c = crop.toLowerCase();

  if (c.includes("maize") || c.includes("corn")) return "corn";
  if (c.includes("rice") || c.includes("paddy")) return "rice";
  if (c.includes("wheat")) return "wheat";
  if (c.includes("tomato")) return "tomato";
  if (c.includes("potato")) return "potato";
  if (c.includes("cotton")) return "cotton";
  if (c.includes("sugarcane")) return "sugarcane";

  return "Unknown";
}

/* -------------------- DISEASE NORMALIZATION -------------------- */
function normalizeDisease(disease) {
  if (!disease) return null;

  const d = disease.toLowerCase();

  if (d.includes("ear rot")) return "ear rot";
  if (d.includes("corn smut")) return "corn smut";
  if (d.includes("late blight")) return "late blight";
  if (d.includes("early blight")) return "early blight";
  if (d.includes("bacterial wilt")) return "bacterial wilt";
  if (d.includes("wheat rust")) return "wheat rust";
  if (d.includes("leaf curl")) return "leaf curl virus";

  return d;
}

/* -------------------- DOMAIN KNOWLEDGE -------------------- */
const HIGH_RISK_DISEASES = [
  "corn smut",
  "late blight",
  "bacterial wilt",
  "panama disease",
  "wheat rust",
  "ear rot"
];

const DISEASE_WARNINGS = {
  "corn smut":
    "Galls can burst and release spores that persist in soil and spread by wind.",
  "ear rot":
    "Infected ears may contain harmful mycotoxins. Avoid consumption without testing."
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

    /* -------------------- NORMALIZE OUTPUT -------------------- */
    result.crop = normalizeCrop(result.crop);
    result.disease = normalizeDisease(result.disease);

    /* -------------------- RISK OVERRIDE -------------------- */
    if (
      result.disease &&
      HIGH_RISK_DISEASES.includes(result.disease)
    ) {
      result.risk = "High";
    }

    /* -------------------- WARNING INJECTION -------------------- */
     if (!result.warning || result.warning === "None") {
      if (DISEASE_WARNINGS[result.disease]) {
        result.warning = DISEASE_WARNINGS[result.disease];
      }
    }

    /* -------------------- GOVERNMENT ADVISORY MAPPING -------------------- */
    const cropKey = result.crop;
    const diseaseKey = result.disease;

    if (
      GOVT_ADVISORY[cropKey] &&
      GOVT_ADVISORY[cropKey][diseaseKey]
    ) {
      const info = GOVT_ADVISORY[cropKey][diseaseKey];

      result.govtAdvisory = info.advisory;
      result.pesticide = info.pesticide || null;
      result.risk = info.risk || result.risk;

      result.warning =
        result.warning ||
        "Based on ICAR / Krishi Vigyan Kendra indicative guidelines";
    }

    /* -------------------- SUPPORT CHECK -------------------- */
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