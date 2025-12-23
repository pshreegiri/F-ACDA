// geminiVision.js
require("dotenv").config();
const fetch = require("node-fetch");

const API_KEY = process.env.GEMINI_API_KEY;

async function analyzeImageWithGemini(imageBase64) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`;

    const body = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are an expert plant pathologist.

Analyze the crop image and ALWAYS return a diagnosis.
Even if uncertain, make the MOST LIKELY diagnosis.

STRICT RULES:
- Respond ONLY in valid JSON
- Do NOT add explanations outside JSON
- Do NOT say "cannot determine"
- Use best visual judgement

JSON FORMAT:
{
  "disease": "string",
  "risk": "Low | Medium | High",
  "actions": ["action1", "action2", "action3"],
  "warning": "string"
}
`
            },
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

    console.log("=== Sending image to Gemini ===");
    console.log("Base64 length:", imageBase64.length);
    console.log("===============================");

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const raw = await response.text();
    console.log("=== Raw Gemini response ===");
    console.log(raw);
    console.log("===========================");

    if (!response.ok) {
      throw new Error(raw || "Empty Gemini response");
    }

    const data = JSON.parse(raw);

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return { analysis: "AI analysis unavailable." };
    }

    return { analysis: text };

  } catch (err) {
    console.error("Gemini Vision Error:", err);
    return { analysis: "AI analysis unavailable." };
  }
}

module.exports = { analyzeImageWithGemini };
