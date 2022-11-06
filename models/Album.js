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

const AlbumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter Song name"],
  },
  duration: {
    type: String,
  },
  cover: {
    type: String,
  },
  song: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Song",
      required: [true, "Please a song"],
    },
  ],

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  reviews: [commentSchema],
  albumrating: {
    type: Number,
    required: true,
    default: 0,
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Album", AlbumSchema);
