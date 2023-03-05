const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Competiton = require("../models/Competiton");
const User = require("../models/User");
const CompetitonPayment = require("../models/CompetitonPayment");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");

// @desc    Create Song/
// @route   POST/api/v1/auth/
// @access   Private/Artist
exports.createCompetiton = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

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
  const containerName = "cover";
  const blobService = azureStorage.createBlobService(process.env.BLOB_KEY);
  const blobName = thumb.name;
  const stream = intoStream(thumb.data);
  const streamLength = thumb.data.length;
  await blobService.createBlockBlobFromStream(
    containerName,
    blobName,
    stream,
    streamLength,
    (err) => {
      if (err) {
        return next(new ErrorResponse(err, 500));
      }
    }
  );

  req.body.cover = `https://upcomastorage.blob.core.windows.net/cover/${thumb.name}`;

  req.body.host = user._id;
  const data = await Competiton.create(req.body);
  res.status(201).json({
    success: true,
    data,
  });
});

// @desc    Get All Genre
// @route   POST/api/v1/auth/
// @access   Private/Admin
exports.getCompetitons = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get All Genre
// @route   POST/api/v1/auth/
// @access   Private/Admin
exports.registerCompetiton = asyncHandler(async (req, res, next) => {
  const event = await Competiton.findById(req.params.id);
  req.body.user = req.user.id;
  req.body.competiton = req.params.id;
  const attend = event.competitors;

  attend.push(req.user.id);
  await Competiton.findByIdAndUpdate(
    event._id,
    { competitors: attend },
    {
      new: true,
      runValidators: true,
    }
  );

  // await CompetitonPayment.create(req.body);
  res.status(200).json({
    success: true,
  });
});

// @desc    Get All Genre
// @route   POST/api/v1/auth/
// @access   Private/Admin
exports.getSingleCompetiton = asyncHandler(async (req, res, next) => {
  const event = await Competiton.findById(req.params.id).populate({
    path: "competitors",
    select: "firstname lastname email bio gender rank",
  });
  res.status(200).json({
    success: true,
    data: event,
  });
});

// @desc    Delete User
// @route   DELTE/api/v1/admin/:id
// @access   Private/Admin
exports.deleteCompetiton = asyncHandler(async (req, res, next) => {
  await Competiton.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get All Genre
// @route   POST/api/v1/auth/
// @access   Private/Admin
exports.updateCompetiton = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  await Competiton.findByIdAndUpdate(event._id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
  });
});

// @desc    Get All Genre
// @route   POST/api/v1/auth/
// @access   Private/Admin
exports.myCompetitions = asyncHandler(async (req, res, next) => {
  const event = await Competiton.find();

  const data = [];
  for (var i = 0; i < event.length; i++) {
    const singleEvent = event[i]?.competitors?.includes(req.user.id);
    if (singleEvent) {
      data.push(event[i]);
    }
  }

  res.status(200).json({
    success: true,
    data,
  });
});
