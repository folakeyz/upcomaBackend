const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter Song name"],
  },
  artist: {
    type: String,
    required: [true, "Please enter Artist name"],
  },
  album: {
    type: String,
  },
  duration: {
    type: String,
  },
  cover: {
    type: String,
  },
  song: {
    type: String,
  },
  genre: {
    type: mongoose.Schema.ObjectId,
    ref: "Genre",
    required: [true, "Please enter Genre"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  stream: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Song", SongSchema);
