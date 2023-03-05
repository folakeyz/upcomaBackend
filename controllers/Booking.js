const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Booking = require("../models/Booking");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");

// @desc    Create Genre/
// @route   POST/api/v1/auth/
// @access   Public
exports.createBooking = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  await Booking.create(req.body);
  const user = await User.findById(req.body.talent);

  //Create reset url
  const resetUrl = `${req.protocol}://${req.get("host")}/app/musician/bookings`;
  const salutation = `Dear ${user.firstname}`;
  const content = `You have just been booked, check the app for more information.\n\n
  <a href="${resetUrl}" style="padding:1rem;color:black;background:#ff4e02;border-radius:5px;text-decoration:none;">Click Here</a> \n\n
  `;
  await sendEmail({
    email: user.email,
    subject: "New Booking",
    salutation,
    content,
  });
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

// @desc    Create Genre/
// @route   POST/api/v1/auth/
// @access   Public
exports.talentBooking = asyncHandler(async (req, res, next) => {
  const data = await Booking.find({ talent: req.user.id }).populate([
    {
      path: "talent",
      select: "firstname lastname email bio rank stagename",
    },
    { path: "user", select: "firstname lastname email bio rank stagename" },
  ]);
  res.status(200).json({
    success: true,
    data,
  });
});
