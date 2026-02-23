const express = require("express");
const axios = require("axios");
const { fetchDetails, generatePlayerUrl, fetchDiscover } = require("../data/api");

const router = express.Router();

// Get discovery series
router.get("/", async (req, res) => {
  try {
    const { genre, page } = req.query;
    const data = await fetchDiscover("tv", genre, page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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

// Get season details
router.get("/:id/season/:season_number", async (req, res) => {
  try {
    const { id, season_number } = req.params;
    const response = await axios.get(
      `${process.env.TMDB_BASE_URL}/tv/${id}/season/${season_number}?api_key=${process.env.TMDB_API_KEY}`,
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
