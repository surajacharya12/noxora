const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mediaId: { type: String, required: true },
    mediaType: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
