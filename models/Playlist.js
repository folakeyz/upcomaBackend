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
      refPath: "_sid",
    },
  ],
  _sid: {
    type: String,
    enum: ["Song", "DJ", "Beat", "Comedy"],
    // default: "Song",
  },
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
