const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const slugify = require("slugify");

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please add Firstname"],
  },
  lastname: {
    type: String,
    required: [true, "Please add Lastname"],
  },
  stagename: {
    type: String,
  },
  perHour: { type: Number, default: 0 },
  currency: {
    type: String,
    enum: ["NGN", "USD"],
    default: "NGN",
  },
  email: {
    type: String,
    required: [true, "Please add Email"],
    unique: true,
  },
  mobile: {
    type: String,
    unique: true,
  },
  role: {
    type: String,
    enum: [
      "SuperAdmin",
      "Admin",
      "Listener",
      "DJ",
      "Label",
      "Comedian",
      "Artist",
      "Producer",
    ],
    default: "Admin",
  },
  rank: {
    type: String,
    enum: ["Bronze", "Silver", "Platinum", "Gold"],
    default: "Bronze",
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  likedSongs: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Song",
    },
  ],
  likedBeats: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Beat",
    },
  ],
  myBeats: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Beat",
    },
  ],
  playlist: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Playlist",
    },
  ],
  gender: {
    type: String,
  },
  photo: {
    type: String,
  },
  bio: {
    type: String,
  },
  followers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  likes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
//Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//match user entered password to hashed password in db
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
//Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model("User", UserSchema);
