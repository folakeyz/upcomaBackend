const fs = require("fs");
const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Beat = require("../models/Beat");
const User = require("../models/User");
const Trending = require("../models/Trending");
const { getAudioDurationInSeconds } = require("get-audio-duration");

// @desc    Create Song/
// @route   POST/api/v1/auth/
// @access   Private/Artist
exports.createBeat = asyncHandler(async (req, res, next) => {
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
  file.mv(`${process.env.FILE_UPLOAD_PATH}/beats/${file.name}`, async (err) => {
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
  req.body.song = `/uploads/beats/${file.name}`;
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

  const data = await Beat.create(req.body);
  if (data) {
    const comments = {
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment,
    };
    data.comments.push(comments);

    data.numReviews = data.comments.length;
    data.rating =
      data.comments.reduce((acc, item) => item.rating + acc, 0) /
      data.comments.length;

    await data.save();
  }
  res.status(201).json({
    success: true,
    data,
  });
});

// @desc    Get All Songs
// @route   POST/api/v1/songs/
// @access   Public
exports.getBeats = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get All Songs
// @route   POST/api/v1/songs/
// @access   Public
exports.likeBeat = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const orin = await Beat.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse("Not Found", 404));
  }
  const songs = user.likedBeats;
  const orins = orin.likes;
  const exist = songs.find((x) => x == req.params.id);
  const existSong = orins.find((x) => x == req.user.id);

  if (exist && existSong) {
    const remove = songs.filter((x) => x != req.params.id);
    const removeUser = orins.filter((x) => x != req.user.id);
    await User.findByIdAndUpdate(
      user._id,
      {
        likedBeats: remove,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    await Song.findByIdAndUpdate(
      orins._id,
      {
        likes: removeUser,
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
  }

  songs.push(req.params.id);
  orins.push(req.user.id);

  await User.findByIdAndUpdate(
    user._id,
    {
      likedBeats: songs,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  const a = await Beat.findByIdAndUpdate(
    orin._id,
    {
      likes: orins,
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
exports.likedBeats = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user.likedBeats,
  });
});

// @desc    Get Liked songs
// @route   GET/api/v1/songs/like/:id
// @access   Public
exports.updatePlay = asyncHandler(async (req, res, next) => {
  const song = await Beat.findById(req.params.id);

  // get Week
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil(days / 7);
  const year = currentDate.getFullYear();
  const week = `Week: ${weekNumber} ${year}`;

  await Beat.findByIdAndUpdate(
    song._id,
    {
      stream: song.stream + 1,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  const trends = await Trending.find();
  const filterTrends = trends?.find((x) => x.song?.week === week);

  if (filterTrends) {
    const songs = filterTrends.song.songs;
    const exist = songs.find((x) => x == req.params.id);
    if (exist) {
      return res.status(200).json({
        success: true,
      });
    }

    songs.push(req.params.id);
    const datas = {
      song: {
        week: week,
        songs: songs,
      },
    };
    await Trending.findByIdAndUpdate(filterTrends._id, datas, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
    });
  }
  const data = {
    song: {
      week: week,
      songs: req.params.id,
    },
  };
  const tren = await Trending.create(data);
  res.status(200).json({
    success: true,
  });
});

// @desc    Get All Songs
// @route   POST/api/v1/songs/
// @access   Public
exports.addComments = asyncHandler(async (req, res, next) => {
  const song = await Beat.findById(req.params.id);
  if (!song) {
    return next(new ErrorResponse("Not Found", 404));
  }
  const userComments = song?.comments;
  const comments = {
    user: req.user.id,
    rating: req.body.rating,
    comment: req.body.comment,
  };
  userComments.push(comments);

  song.numReviews = song.comments.length;

  song.rating =
    song.comments.reduce((acc, item) => item.rating + acc, 0) /
    song.comments.length;

  await song.save();

  res.status(200).json({
    success: true,
    song,
  });
});