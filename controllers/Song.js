const fs = require("fs");
const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Song = require("../models/Song");
const User = require("../models/User");
const { getAudioDurationInSeconds } = require("get-audio-duration");

// @desc    Create Song/
// @route   POST/api/v1/auth/
// @access   Private/Artist
exports.createSong = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const file = req.files.song;
  //Make sure the image is a photo
  if (!file.mimetype.startsWith("audio")) {
    return next(new ErrorResponse(`Please Upload an audio file`, 400));
  }
  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please Upload a Song less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  //crete custom filename
  file.name = `${user._id}_${file.name}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/songs/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`An error occured while uploading`, 500));
    }
  });

  const thumb = req.files.cover;
  //Make sure the image is a photo
  if (!thumb.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please Upload an Image`, 400));
  }

  // Check filesize
  if (thumb.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please Upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  //crete custom filename
  thumb.name = `${user._id}_${thumb.name}${path.parse(thumb.name).ext}`;
  thumb.mv(
    `${process.env.FILE_UPLOAD_PATH}/cover/${thumb.name}`,
    async (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`An error occured while uploading`, 500));
      }
    }
  );

  req.body.cover = `/cover/${thumb.name}`;
  req.body.song = `/songs/${file.name}`;
  req.body.user = user._id;

  console.log(req.body.song);
  // From a local path...
  getAudioDurationInSeconds(`public/uploads${req.body.song}`).then(
    (duration) => {
      console.log(duration / 60);
    }
  );

  //   const data = await Song.create(req.body);
  //   res.status(201).json({
  //     success: true,
  //     data,
  //   });
});

// @desc    Get All Songs
// @route   POST/api/v1/songs/
// @access   Public
exports.getSongs = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});
