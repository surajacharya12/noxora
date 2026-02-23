const express = require("express");
const { fetchTrending } = require("../data/api");

const router = express.Router();

// Get trending content
router.get("/", async (req, res) => {
  try {
    const type = req.query.type || "all"; // 'all', 'movie', 'tv'
    const page = req.query.page || 1;
    const data = await fetchTrending(type, page);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
