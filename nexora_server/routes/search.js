const express = require("express");
const { searchMulti } = require("../data/api");

const router = express.Router();

// Test Search
router.get("/test", async (req, res) => {
  try {
    const query = "Ant-Man";
    const results = await searchMulti(query);
    
    // Find the specific movie and enhance with player info
    const antMan = results.find(m => m.title === "Ant-Man" || m.name === "Ant-Man");
    
    if (!antMan) {
      return res.json({ message: "Ant-Man not found in TMDB results", results });
    }

    res.json({
      message: "Found Ant-Man with streaming player",
      movie: antMan,
      streamingUrl: `https://www.vidking.net/embed/movie/${antMan.id}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search movies and series
router.get("/", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Query is required" });

    const results = await searchMulti(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
