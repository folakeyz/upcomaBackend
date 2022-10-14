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
