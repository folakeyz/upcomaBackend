const express = require("express");
const {
  createUser,
  login,
  getMe,
  getUser,
  updateProfile,
  uploadPhoto,
  deleteUser,
  getSingleUser,
  likeUser,
  followUser,
} = require("../controllers/User");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router
  .route("/")
  .post(createUser)
  .get(
    advancedResults(User, [
      {
        path: "song",
        select: "name album duration genre cover stream",
      },
      {
        path: "likedSongs",
        select: "name album duration genre cover stream",
      },
    ]),
    getUser
  );
router.route("/me").get(protect, getMe).put(protect, updateProfile);
router
  .route("/:id")
  .delete(protect, authorize("SuperAdmin"), deleteUser)
  .get(getSingleUser);

router.route("/login").post(login);

router.route("/photo").post(protect, uploadPhoto);
router.route("/like/:id").put(protect, likeUser);
router.route("/follow/artist/:id").put(protect, followUser);

module.exports = router;
