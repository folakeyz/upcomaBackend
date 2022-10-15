const mongoose = require("mongoose");

const TrendingSchema = new mongoose.Schema({
  song: {
    week: { type: String },
    songs: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Song",
        required: [true, "Please enter Song"],
      },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Trending", TrendingSchema);
