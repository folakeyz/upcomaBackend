const fs = require("fs");
const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Song = require("../models/Song");
const Album = require("../models/Album");
const User = require("../models/User");
const azureStorage = require("azure-storage");
const intoStream = require("into-stream");

// @desc    Create Song/
// @route   POST/api/v1/auth/
// @access   Private/Artist

exports.createAlbum = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const songs = JSON.parse(req.body.songs);
  req.body.user = req.user.id;
  req.body.song = songs;

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
  var duration = 0;

  for (var i = 0; i < songs.length; i++) {
    const song = await Song.findById(songs[i]);
    var time = song.duration;
    const newT = time.replace(":", ".");
    duration = duration + parseFloat(newT);
  }
  const songDuration = duration.toString();
  req.body.duration = songDuration.replace(".", ":");

  const album = await Album.create(req.body);

  if (album) {
    const comments = {
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment,
    };
    album.reviews.push(comments);

    album.numReviews = album.reviews.length;
    console.log(album.reviews.length);
    album.albumrating =
      album.reviews.reduce((acc, item) => item.rating + acc, 0) /
      album.reviews.length;

    await album.save();
  }

  res.status(201).json({
    success: true,
    album,
  });
});

// @desc    Get All Songs
// @route   POST/api/v1/songs/
// @access   Public
exports.getAlbums = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});
