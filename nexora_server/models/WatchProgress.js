const mongoose = require("mongoose");

const watchProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mediaId: { type: String, required: true },
    mediaType: { type: String, required: true }, // movie or tv
    minutesWatched: { type: Number, required: true },
    lastWatched: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("WatchProgress", watchProgressSchema);
