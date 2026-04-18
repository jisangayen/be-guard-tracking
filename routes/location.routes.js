const express = require("express");
const axios = require("axios");

const router = express.Router();
router.get("/reverse", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ msg: "Lat & Lng required" });
    }

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat,
          lon: lng,
          format: "json",
          "accept-language": "en", // Ensures address is in English
          zoom: 18,
        },
        headers: {
          // IMPORTANT: Make this unique and add a real email
          "User-Agent":
            "GuardTrackingSystem/1.0 (contact: your-email@gmail.com)",
          Referer: "http://yourdomain.com", // Adding a referer helps prevent 403s
        },
      },
    );

    const address = response.data.display_name || "Address not found";
    res.json({ address });
  } catch (error) {
    // Check if the error is a 403
    if (error.response && error.response.status === 403) {
      console.error("❌ 403 Forbidden: Nominatim has blocked this request.");
    }
    res.status(error.response?.status || 500).json({
      msg: "Failed to fetch address",
      error: error.message,
    });
  }
});

module.exports = router;
