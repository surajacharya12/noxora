const express = require("express");
const WatchProgress = require("../models/WatchProgress");
const auth = require("../middleware/auth");

const router = express.Router();

// Get watch progress
router.get("/", auth, async (req, res) => {
  try {
    const progress = await WatchProgress.find({ userId: req.user.id });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update watch progress
router.post("/", auth, async (req, res) => {
  try {
    const { mediaId, mediaType, minutesWatched } = req.body;
    let progress = await WatchProgress.findOne({
      userId: req.user.id,
      mediaId,
    });

    if (progress) {
      progress.minutesWatched = minutesWatched;
      progress.lastWatched = Date.now();
    } else {
      progress = new WatchProgress({
        userId: req.user.id,
        mediaId,
        mediaType,
        minutesWatched,
      });
    }

    await progress.save();
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
