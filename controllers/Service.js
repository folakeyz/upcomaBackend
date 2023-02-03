const fs = require("fs");
const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const { getAudioDurationInSeconds } = require("get-audio-duration");
const Service = require("../models/Service");
const User = require("../models/User");

// @desc    Create Song/
// @route   POST/api/v1/auth/
// @access   Private/Artist
exports.createService = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const user = await User.findById(req.user.id);

  const thumb = req.files.cover;
  const file = req.files.song;
  if (thumb && file) {
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
          return next(
            new ErrorResponse(`An error occured while uploading`, 500)
          );
        }
      }
    );
    req.body.cover = `/uploads/cover/${thumb.name}`;

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
    file.mv(
      `${process.env.FILE_UPLOAD_PATH}/songs/${file.name}`,
      async (err) => {
        if (err) {
          console.error(err);
          return next(
            new ErrorResponse(`An error occured while uploading`, 500)
          );
        }
      }
    );
    req.body.song = `/uploads/songs/${file.name}`;
  }

  const songDuration = await getAudioDurationInSeconds(
    `public${req.body.song}`
  ).then((duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    function padTo2Digits(num) {
      return num.toString().padStart(2, "0");
    }
    const result = `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
    return result.slice(0, 5);
  });
  req.body.duration = songDuration;

  const data = await Service.create(req.body);
  res.status(201).json({
    success: true,
    data,
  });
});

// @desc    Get All Songs
// @route   POST/api/v1/songs/
// @access   Public
exports.getServices = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});