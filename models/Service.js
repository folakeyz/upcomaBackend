const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  service: {
    type: String,
    required: [true, "Please enter Song name"],
  },

  cover: {
    type: String,
  },
  logo: {
    type: String,
  },
  song: { type: String },
  songName: { type: String },
  album: { type: String },
  genre: { type: String },
  description: { type: String },
  phone: { type: String },
  duration: { type: String },
  artist: { type: String },

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

module.exports = mongoose.model("Service", ServiceSchema);
