const express = require("express");
const { fetchDetails, generatePlayerUrl } = require("../data/api");

const router = express.Router();

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
