const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter banner title"],
  },
  text: {
    type: String,
    required: [true, "Please enter banner text"],
  },
  backdrop: {
    type: String,
    required: [true, "Please enter banner image"],
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

module.exports = mongoose.model("Banner", BannerSchema);
