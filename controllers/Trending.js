const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Song = require("../models/Song");

// @desc    Get Liked songs
// @route   GET/api/v1/songs/like/:id
// @access   Public
exports.getTrending = asyncHandler(async (req, res, next) => {
  const song = await Song.find();
  await Song.findByIdAndUpdate(
    song._id,
    {
      play: song.play + 1,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    success: true,
  });
});
