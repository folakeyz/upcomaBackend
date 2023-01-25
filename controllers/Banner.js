const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Banner = require("../models/Banner");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");

// @desc    Create User/
// @route   POST/api/v1/auth/
// @access   Public
exports.createBanner = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

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

  req.body.backdrop = `https://upcomastorage.blob.core.windows.net/cover/${thumb.name}`;

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
