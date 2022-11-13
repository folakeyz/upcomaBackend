const fs = require("fs");
const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Song = require("../models/Song");
const Playlist = require("../models/Playlist");
const User = require("../models/User");

// @desc    Create Song/
// @route   POST/api/v1/auth/
// @access   Private/Artist
exports.createPlaylist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const covers = [
    "/uploads/playlist/1.jpeg",
    "/uploads/playlist/2.jpeg",
    "/uploads/playlist/3.jpg",
    "/uploads/playlist/4.jpg",
    "/uploads/playlist/5.jpg",
    "/uploads/playlist/6.jpg",
    "/uploads/playlist/7.jpeg",
    "/uploads/playlist/8.jpg",
    "/uploads/playlist/9.jpg",
    "/uploads/playlist/10.jpg",
    "/uploads/playlist/11.jpg",
  ];
  req.body.user = user._id;
  req.body.cover = covers[Math.floor(Math.random() * covers.length)];
  const playlist = await Playlist.create(req.body);
  const myplaylist = user.playlist;
  myplaylist.push(playlist._id);

  await user.save();

  res.status(201).json({
    success: true,
    playlist,
  });
});

// @desc    Get All Songs
// @route   POST/api/v1/songs/
// @access   Public
exports.getPlaylist = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Create Song/
// @route   POST/api/v1/auth/
// @access   Private/Artist
exports.addSongToPlaylist = asyncHandler(async (req, res, next) => {
  const songs = JSON.parse(req.body.songs);
  const playlist = await Playlist.findById(req.params.id);

  const currentPlaylist = playlist.song;

  currentPlaylist.push(...songs);
  await playlist.save();

  res.status(200).json({
    success: true,
    playlist,
  });
});
