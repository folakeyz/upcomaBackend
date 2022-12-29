const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Stream = require("../models/Stream");
const User = require("../models/User");

// @desc    Create Song/
// @route   POST/api/v1/auth/
// @access   Private/Artist
exports.getTrendingSong = asyncHandler(async (req, res, next) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = `${monthNames[currentDate.getMonth()]}`;

  const stream = await Stream.find({
    month: month,
    year: year,
    _sid: "Song",
  })
    .populate({
      path: "song",
      select:
        "name artist duration cover genre stream rating comments numReviews",
    })
    .sort({ stream: -1, rating: -1 });

  res.status(200).json({
    success: true,
    data: stream,
  });
});

// @desc    Get All Songs
// @route   POST/api/v1/songs/
// @access   Public
exports.getStreams = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Create Song/
// @route   POST/api/v1/auth/
// @access   Private/Artist
exports.getTrending = asyncHandler(async (req, res, next) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = `${monthNames[currentDate.getMonth()]}`;

  const stream = await Stream.find({
    month: month,
    year: year,
  })
    .populate({
      path: "song",
      select:
        "name artist duration cover genre stream rating comments numReviews",
    })
    .sort({ stream: -1, rating: -1 });

  res.status(200).json({
    success: true,
    data: stream,
  });
});

// @desc    Create Song/
// @route   POST/api/v1/auth/
// @access   Private/Artist
exports.getTopTalents = asyncHandler(async (req, res, next) => {
  const user = await User.find().sort({ followersCount: -1, likesCount: -1 });
  const filter = user.filter((x) => x.role !== "Listener");
  res.status(200).json({
    success: true,
    data: filter,
  });
});
