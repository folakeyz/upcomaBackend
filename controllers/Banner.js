const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Banner = require("../models/Banner");

// @desc    Create User/
// @route   POST/api/v1/auth/
// @access   Public
exports.createBanner = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  await Banner.create(req.body);
  res.status(201).json({
    success: true,
  });
});

// @desc    Get All User
// @route   POST/api/v1/auth/
// @access   Private/Admin
exports.getBanner = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Update Admin Profile
// @route   PUT/api/v1/auth/me/:id
// @access   Private

exports.updateBanner = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    title: req.body.title,
    text: req.body.text,
  };

  const data = await Banner.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data,
  });
});

// @desc    Delete User
// @route   DELTE/api/v1/admin/:id
// @access   Private/Admin
exports.deleteBanner = asyncHandler(async (req, res, next) => {
  await Banner.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
