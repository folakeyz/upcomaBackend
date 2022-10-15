const fs = require("fs");
const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Song = require("../models/Song");
const User = require("../models/User");
const Trending = require("../models/Trending");
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
  req.body.cover = `/uploads/cover/${thumb.name}`;
  req.body.song = `/uploads/songs/${file.name}`;
  req.body.user = user._id;
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

  const data = await Song.create(req.body);
  res.status(201).json({
    success: true,
    data,
  });
});

// @desc    Get All Songs
// @route   POST/api/v1/songs/
// @access   Public
exports.getSongs = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get All Songs
// @route   POST/api/v1/songs/
// @access   Public
exports.likeSong = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorResponse("Not Found", 404));
  }
  const songs = user.likedSongs;
  const exist = songs.find((x) => x == req.params.id);

  if (exist) {
    const remove = songs.filter((x) => x != req.params.id);
    await User.findByIdAndUpdate(
      user._id,
      {
        likedSongs: remove,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json({
      success: true,
      data: "Removed from Favorites",
    });
  } else {
    songs.push(req.params.id);
  }

  await User.findByIdAndUpdate(
    user._id,
    {
      likedSongs: songs,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(201).json({
    success: true,
    data: "Added to Favorites",
  });
});

// @desc    Get Liked songs
// @route   GET/api/v1/songs/like/:id
// @access   Public
exports.likedSongs = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user.likedSongs,
  });
});

// @desc    Get Liked songs
// @route   GET/api/v1/songs/like/:id
// @access   Public
exports.updatePlay = asyncHandler(async (req, res, next) => {
  const song = await Song.findById(req.params.id);

  // get Week
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil(days / 7);
  const year = currentDate.getFullYear();
  const week = `Week: ${weekNumber} ${year}`;

  await Song.findByIdAndUpdate(
    song._id,
    {
      play: song.stream + 1,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  const trends = await Trending.find();
  const filterTrends = trends?.find((x) => x.song?.week === week);
  //const songs = filterTrends.song.week;
  //const exist = songs.find((x) => x == req.params.id);

  // song: {
  //     week: { type: String },
  //     songs: [
  //       {
  //         type: mongoose.Schema.ObjectId,
  //         ref: "Song",
  //         required: [true, "Please enter Song"],
  //       },
  //     ],
  //   }

  console.log(trends, "trends");
  console.log(filterTrends, "filter");

  // if (trends) {
  //   if (exist) {
  //     return res.status(200).json({
  //       success: true,
  //     });
  //   }
  //   songs.push(req.params.id);
  //   await Trending.findByIdAndUpdate(
  //     song._id,
  //     {
  //       week: songs,
  //     },
  //     {
  //       new: true,
  //       runValidators: true,
  //     }
  //   );

  //   return res.status(200).json({
  //     success: true,
  //   });
  // }
  const data = {
    song: {
      week: week,
      songs: req.params.id,
    },
  };
  const tren = await Trending.create(data);
  console.log(tren);
  res.status(200).json({
    success: true,
  });
});
