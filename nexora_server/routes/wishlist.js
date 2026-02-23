const express = require("express");
const Wishlist = require("../models/Wishlist");
const auth = require("../middleware/auth");

const router = express.Router();

// Get wishlist
router.get("/", auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user.id });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to wishlist
router.post("/", auth, async (req, res) => {
  try {
    const { mediaId, mediaType } = req.body;
    const item = new Wishlist({ userId: req.user.id, mediaId, mediaType });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from wishlist
router.delete("/:id", auth, async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
