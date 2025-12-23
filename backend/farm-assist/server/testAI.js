require("dotenv").config();
const fetch = require("node-fetch"); // Node < 18

async function testAIStudio() {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/responses:generate?key=${API_KEY}`;

    const body = {
      model: "gemini-3-flash-preview",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Hello from AI Studio. Please respond with a short message."
            }
          ]
        }
      ]
    };

    console.log("Sending body to Gemini:", JSON.stringify(body, null, 2));

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const raw = await res.text();
    console.log("Raw API response:", raw);

    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.error("Failed to parse JSON:", err);
      return;
    }

    // Try to extract text from Gemini 3 Flash Preview response
    let output = "";
    if (data.output_text) {
      output = data.output_text;
    } else if (
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content[0] &&
      data.candidates[0].content[0].text
    ) {
      output = data.candidates[0].content[0].text;
    } else {
      output = JSON.stringify(data);
    }

    console.log("Parsed AI Response:", output);

  } catch (err) {
    console.error("Error calling Gemini:", err);
  }
}

testAIStudio();
