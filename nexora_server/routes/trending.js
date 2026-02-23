const express = require("express");
const { fetchTrending } = require("../data/api");

const router = express.Router();

// Get trending content
router.get("/", async (req, res) => {
  try {
    const type = req.query.type || "all"; // 'all', 'movie', 'tv'
    const results = await fetchTrending(type);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
