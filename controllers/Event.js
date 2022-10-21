const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Event = require("../models/Event");
const User = require("../models/User");

// @desc    Create Song/
// @route   POST/api/v1/auth/
// @access   Private/Artist
exports.createEvent = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const thumb = req.files.cover;
  console.log(req.files);
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
    `${process.env.FILE_UPLOAD_PATH}/event/${thumb.name}`,
    async (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`An error occured while uploading`, 500));
      }
    }
  );
  req.body.cover = `/uploads/event/${thumb.name}`;
  req.body.user = user._id;
  const data = await Event.create(req.body);
  res.status(201).json({
    success: true,
    data,
  });
});

// @desc    Get All Genre
// @route   POST/api/v1/auth/
// @access   Private/Admin
exports.getEvents = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get All Genre
// @route   POST/api/v1/auth/
// @access   Private/Admin
exports.registerEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  const attend = event.attendees;

  attend.push(req.user.id);
  await Event.findByIdAndUpdate(
    event._id,
    { attendees: attend },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    success: true,
  });
});
