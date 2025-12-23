// server/services/geminiVision.js
const fetch = require("node-fetch");

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is missing");
}

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=" +
  API_KEY;

/**
 * Single-call Gemini image analysis
 * @param {string} imageBase64
 * @returns {Object} status + optional analysis
 */
async function analyzeImageWithGemini(imageBase64) {
  const prompt = `
You are an expert agricultural computer vision system.

Your task is to analyse an image and return structured crop disease information.

STEP 1: Determine if the image contains a real plant or crop.
If it does NOT, return ONLY:
{
  "isPlant": false
}

STEP 2: If a plant IS present, identify the visible plant part.
Choose ONE:
- leaf
- stem
- ear_or_cob
- panicle
- grain
- fruit
- whole_plant
- field
- unknown

STEP 3: Identify the crop IF POSSIBLE based on visible features.
Only choose when reasonably confident.
Possible crops include but are not limited to:
- wheat
- rice
- maize (corn)
- tomato
- potato
- cotton
- sugarcane
If unsure, use "Unknown".

STEP 4: Identify visible disease symptoms on the identified plant part.
If no disease is visible, mark disease as "Healthy".

STEP 5: Assess risk level based on severity:
- Low
- Medium
- High

STEP 6: Provide clear, practical farmer actions.
Provide 3–6 short actions.
If disease is Healthy, actions should focus on monitoring and prevention.

Return STRICT JSON ONLY in this exact format:

{
  "isPlant": true,
  "plantPart": "leaf | stem | ear_or_cob | panicle | grain | fruit | whole_plant | field | unknown",
  "crop": "crop name or Unknown",
  "disease": "Disease name or Healthy",
  "risk": "Low | Medium | High",
  "actions": ["action1", "action2"],
  "warning": "string or None"
}

Rules:
- Do NOT analyze animals, humans, or objects
- Do NOT guess crop or disease without visual evidence
- Do NOT include explanations or markdown
- Do NOT include extra keys
- Output JSON ONLY
`.trim();

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: "image/jpeg",
              data: imageBase64
            }
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const raw = await response.text();

    // 🔒 HARD GUARANTEE: quota handling
    if (response.status === 429) {
      return { status: "RATE_LIMITED" };
    }

    // 🔒 Any non-OK response but not quota
    if (!response.ok) {
      console.error("❌ Gemini non-OK response:", raw);
      return { status: "ERROR" };
    }

    // 🔒 Parse Gemini wrapper JSON safely
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.error("❌ Gemini wrapper JSON invalid:", raw);
      return { status: "INVALID_RESPONSE" };
    }

    const text =
      parsed?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      return { status: "INVALID_RESPONSE" };
    }

    return {
      status: "OK",
      analysis: text
    };

  } catch (err) {
    console.error("❌ Gemini Vision Error:", err.message);
    return { status: "ERROR" };
  }
}

module.exports = { analyzeImageWithGemini };
