const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// @desc    Create User/
// @route   POST/api/v1/auth/
// @access   Public
exports.createUser = asyncHandler(async (req, res, next) => {
  await User.create(req.body);
  res.status(201).json({
    success: true,
  });
});

// @desc    Get All User
// @route   POST/api/v1/auth/
// @access   Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get All User
// @route   POST/api/v1/auth/
// @access   Private/Admin
exports.getSingleUser = asyncHandler(async (req, res, next) => {
  const data = await User.findById(req.params.id);
  res.status(200).json({
    success: true,
    data,
  });
});

// @desc    Login User
// @route   POST/api/v1/auth/login
// @access   Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //validate email & password
  if (!email || !password) {
    return next(new ErrorResponse("Please Provide an email and password", 400));
  }
  //check for user
  const user = await User.findOne({ email: email })
    .select("+password")
    .populate({
      path: "followers",
      select: "firstname lastname email bio rank photo gender",
    });

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  //check if password match
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Log user out / clear cookie
// @route  GET /api/v1/auth/logout
// @access   Private

exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get current logged in user
// @route   POST/api/v1/auth/me
// @access   Private

exports.getMe = asyncHandler(async (req, res, next) => {
  const data = await User.findById(req.user.id).populate([
    {
      path: "song",
      select: "name album duration genre cover song",
    },
    {
      path: "likedSongs",
      select: "name album duration genre cover",
    },
    {
      path: "followers",
      select: "firstname lastname email bio rank",
    },
    {
      path: "playlist",
      select: "name cover song",
      populate: {
        path: "song",
        select: "name album duration genre cover stream song",
      },
    },
  ]);
  res.status(200).json({
    success: true,
    data,
  });
});

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

// @desc    Update Admin Profile
// @route   PUT/api/v1/auth/me/:id
// @access   Private

exports.updateProfile = asyncHandler(async (req, res, next) => {
  const data = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data,
  });
});

// @desc    Update User Profile
// @route   PUT/api/v1/auth/me/:id
// @access   Private

exports.uploadPhoto = asyncHandler(async (req, res, next) => {
  const data = await User.findById(req.user.id);

  if (!req.files) {
    return next(new ErrorResponse(`Please Upload a picture`, 400));
  }

  const file = req.files.photo;

  //Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please Upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please Upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  //crete custom filename
  file.name = `photo_${data._id}${path.parse(file.name).ext}`;

  file.mv(
    `${process.env.FILE_UPLOAD_PATH}/profile/${file.name}`,
    async (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`An error occured while uploading`, 500));
      }
      await User.findByIdAndUpdate(req.user.id, {
        photo: `/uploads/profile/${file.name}`,
      });
      res.status(200).json({
        success: true,
        data: file.name,
      });
    }
  );
});

// @desc    Delete User
// @route   DELTE/api/v1/admin/:id
// @access   Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Delete User
// @route   DELTE/api/v1/admin/:id
// @access   Private/Admin
exports.followUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse(`User Not Found`, 404));
  }
  const followers = user?.followers;
  const exist = followers.find((x) => x == req.user.id);

  if (exist) {
    const remove = followers.filter((x) => x != req.user.id);
    await User.findByIdAndUpdate(
      user._id,
      {
        followers: remove,
        followersCount: followers.length - 1,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json({
      success: true,
      data: "User unfollowed",
    });
  } else {
    followers.push(req.user.id);
  }

  await User.findByIdAndUpdate(
    user._id,
    {
      followers: followers,
      followersCount: followers.length,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Delete User
// @route   DELTE/api/v1/admin/:id
// @access   Private/Admin
exports.likeUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse(`User Not Found`, 404));
  }
  const followers = user?.likes;
  const exist = followers.find((x) => x == req.user.id);

  if (exist) {
    const remove = followers.filter((x) => x != req.user.id);
    await User.findByIdAndUpdate(
      user._id,
      {
        likes: remove,
        likesCount: followers.length - 1,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json({
      success: true,
      data: "User unfollowed",
    });
  } else {
    followers.push(req.user.id);
  }

  await User.findByIdAndUpdate(
    user._id,
    {
      likes: followers,
      likesCount: followers.length,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Update Admin Profile
// @route   PUT/api/v1/auth/me/:id
// @access   Private

exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  const data = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data,
  });
});
