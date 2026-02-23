const express = require("express");
const { fetchDetails, generatePlayerUrl, fetchDiscover } = require("../data/api");

const router = express.Router();

// Get discovery movies
router.get("/", async (req, res) => {
  try {
    const { genre, page } = req.query;
    const data = await fetchDiscover("movie", genre, page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get movie details
router.get("/:id", async (req, res) => {
  try {
    const data = await fetchDetails("movie", req.params.id);
    if (!data) return res.status(404).json({ message: "Movie not found" });

    // Include player URL in response
    const playerUrl = generatePlayerUrl({ type: "movie", id: req.params.id });

    res.json({ ...data, playerUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
