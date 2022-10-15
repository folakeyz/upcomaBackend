const express = require("express");
const {
  createUser,
  login,
  getMe,
  getUser,
  updateProfile,
  uploadPhoto,
  deleteUser,
} = require("../controllers/User");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router
  .route("/")
  .post(createUser)
  .get(
    protect,
    advancedResults(User, [
      {
        path: "song",
        select: "name album duration genre cover",
      },
      {
        path: "likedSongs",
        select: "name album duration genre cover",
      },
    ]),
    getUser
  );
router.route("/:id").delete(protect, authorize("SuperAdmin"), deleteUser);

router.route("/login").post(login);

router.route("/me").get(protect, getMe).put(protect, updateProfile);
router.route("/photo").post(protect, uploadPhoto);

module.exports = router;
