const express = require("express");
const { fetchDetails, generatePlayerUrl } = require("../data/api");

const router = express.Router();

// Get series details
router.get("/:id", async (req, res) => {
  try {
    const data = await fetchDetails("tv", req.params.id);
    if (!data) return res.status(404).json({ message: "Series not found" });

    // Include default player URL (Season 1, Episode 1)
    const playerUrl = generatePlayerUrl({
      type: "tv",
      id: req.params.id,
      season: 1,
      episode: 1,
    });

    res.json({ ...data, playerUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
