const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter Event name"],
  },
  date: {
    type: String,
    required: [true, "Please enter Date"],
  },
  time: {
    type: String,
    required: [true, "Please enter Time"],
  },
  location: { type: String, required: [true, "Please enter location"] },
  description: { type: String, required: [true, "Please enter description"] },
  type: {
    type: String,
    enum: ["Paid", "Free"],
    default: "Admin",
  },
  ticket: { type: Number },
  cover: { type: String },
  attendees: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
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

module.exports = mongoose.model("Event", EventSchema);
