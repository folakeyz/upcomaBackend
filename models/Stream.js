const mongoose = require("mongoose");

const StreamSchema = new mongoose.Schema({
  year: { type: String },
  month: { type: String },
  song: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "_sid",
  },
  _sid: {
    type: String,
    required: true,
    enum: ["Song", "DJ", "Beat", "Comedy"],
  },
  stream: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Stream", StreamSchema);
