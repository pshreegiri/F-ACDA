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
You are an agricultural plant disease detection system.

Task:
1. Decide whether the image shows a plant leaf or crop.
2. If it does NOT, return ONLY this JSON:
{
  "isPlant": false
}

If it DOES show a plant leaf or crop, return STRICT JSON ONLY:

{
  "isPlant": true,
  "crop": "tomato | rice | wheat",
  "disease": "Disease name or Healthy",
  "risk": "Low | Medium | High",
  "actions": ["action1", "action2"],
  "warning": "string or None"
}

Rules:
- Do NOT analyze animals, humans, or objects
- Do NOT guess
- Do NOT add explanations
- Do NOT use markdown
- Return JSON ONLY
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
