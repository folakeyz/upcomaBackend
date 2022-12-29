const fs = require("fs");
const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Song = require("../models/Song");
const Album = require("../models/Album");
const User = require("../models/User");
const Comedy = require("../models/Comedy");
const DJ = require("../models/DJ");
const Beat = require("../models/Beat");
const Stream = require("../models/Stream");

// @desc    Create Song/
// @route   POST/api/v1/auth/
// @access   Private/Artist
exports.userChart = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const song = await Song.find({ user: req.user.id });
  const comedy = await Comedy.find({ user: req.user.id });
  const dj = await DJ.find({ user: req.user.id });
  const album = await Album.find({ user: req.user.id });
  const beat = await Beat.find({ user: req.user.id });

  const likes = user.likesCount;
  const followers = user.followersCount;
  const total = song.length + comedy.length + dj.length + beat.length;

  const allContents = [...song, ...comedy, ...dj, ...beat];

  const streams = allContents.reduce((acc, item) => item.stream + acc, 0);
  const stream = await Stream.find().populate({
    path: "song",
    select:
      "name artist duration cover genre stream rating comments numReviews user",
  });

  const own = stream.filter((x) => x?.song?.user == req.user.id);

  res.status(200).json({
    success: true,
    data: {
      likes,
      followers,
      album: album.length,
      total,
      stream: streams,
      analytics: own,
    },
  });
});
