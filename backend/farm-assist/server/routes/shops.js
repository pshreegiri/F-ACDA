const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

router.get("/nearby-shops", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Location required" });
  }

  const radius = 5000; // 5 km
  const keyword = "agro pesticide fertilizer seed agriculture";

  const url =
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
    `?location=${lat},${lng}` +
    `&radius=${radius}` +
    `&keyword=${keyword}` +
    `&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      return res.status(400).json({
        error: data.error_message || "Google Places error",
        status: data.status,
      });
    }

    const filtered = data.results.filter((place) => {
      const name = place.name?.toLowerCase() || "";
      const types = place.types || [];

      return (
        name.includes("agro") ||
        name.includes("pesticide") ||
        name.includes("fertilizer") ||
        name.includes("seed") ||
        types.includes("store")
      );
    });

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch shops" });
  }
});

module.exports = router;
