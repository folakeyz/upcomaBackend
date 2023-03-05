const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Genre = require("../models/Genre");

// @desc    Create Genre/
// @route   POST/api/v1/auth/
// @access   Public
exports.createGenre = asyncHandler(async (req, res, next) => {
  await Genre.create(req.body);
  res.status(201).json({
    success: true,
  });
});

// @desc    Get All Genre
// @route   POST/api/v1/auth/
// @access   Private/Admin
exports.getGenres = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Update Admin Profile
// @route   PUT/api/v1/auth/me/:id
// @access   Private

exports.updateGenre = asyncHandler(async (req, res, next) => {
  const data = await Genre.findByIdAndUpdate(req.params.id, req.body, {
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
exports.deleteGenre = asyncHandler(async (req, res, next) => {
  await Genre.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
