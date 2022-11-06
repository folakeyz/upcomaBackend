const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

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
  comments: [commentSchema],
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0,
  },
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Song", SongSchema);
