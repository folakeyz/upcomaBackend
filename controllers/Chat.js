const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Chat = require("../models/Chat");

// @desc    Create Song/
// @route   POST/api/v1/auth/
// @access   Private/Artist
exports.createChat = asyncHandler(async (req, res, next) => {
  req.body.sender = req.user.id;
  req.body.message = req.body.chat;
  req.body.users = [req.body.sender, req.body.receiver];
  if (!req.body.message) {
    return next(new ErrorResponse(`Message cannot be empty`, 400));
  }
  const data = await Chat.create(req.body);

  res.status(201).json({
    success: true,
    data,
  });
});

// @desc    Get All Songs
// @route   POST/api/v1/songs/
// @access   Public
exports.getChats = asyncHandler(async (req, res, next) => {
  const receiver = req.params.id;
  const sender = req.user.id;

  const messages = await Chat.find({
    users: {
      $all: [sender, receiver],
    },
  }).sort({ updatedAt: 1 });

  const msgs = messages.map((msg) => {
    return {
      fromMe: msg.sender.toString() === sender,
      message: msg.message,
      senderId: msg.sender,
      sender: sender,
    };
  });
  res.status(200).json({
    success: true,
    data: msgs,
  });
});
