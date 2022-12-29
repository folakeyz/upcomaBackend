const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Booking = require("../models/Booking");

// @desc    Create Genre/
// @route   POST/api/v1/auth/
// @access   Public
exports.createBooking = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  await Booking.create(req.body);
  res.status(201).json({
    success: true,
  });
});

// @desc    Get All Genre
// @route   POST/api/v1/auth/
// @access   Private/Admin
exports.getBookings = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Create Genre/
// @route   POST/api/v1/auth/
// @access   Public
exports.myBooking = asyncHandler(async (req, res, next) => {
  const data = await Booking.find({ user: req.user.id }).populate({
    path: "talent",
    select: "firstname lastname email bio rank stagename",
  });
  res.status(201).json({
    success: true,
    data,
  });
});
