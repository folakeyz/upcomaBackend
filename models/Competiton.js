const mongoose = require("mongoose");

const CompetitonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter Event name"],
  },
  date: {
    type: String,
    required: [true, "Please enter Date"],
  },
  deadline: {
    type: String,
    required: [true, "Please enter Deadline"],
  },
  description: { type: String, required: [true, "Please enter description"] },
  prize: {
    type: String,
    required: true,
  },
  cost: { type: Number, default: 10 },
  cover: { type: String },
  competitors: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  host: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Competiton", CompetitonSchema);
