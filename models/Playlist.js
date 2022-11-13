const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter Playlist name"],
  },
  cover: {
    type: String,
  },
  song: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Song",
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Playlist", PlaylistSchema);
