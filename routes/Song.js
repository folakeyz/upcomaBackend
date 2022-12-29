const express = require("express");
const {
  createSong,
  getSongs,
  likeSong,
  likedSongs,
  updatePlay,
  addComments,
  deleteSong,
} = require("../controllers/Song");
const Song = require("../models/Song");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router
  .route("/")
  .post(protect, authorize("Artist", "DJ", "Producer", "Label"), createSong)
  .get(
    advancedResults(Song, [
      {
        path: "user",
        select: "firstname lastname email bio rank",
      },
      {
        path: "genre",
        select: "name ",
      },
      {
        path: "comments",
        populate: {
          path: "user",
          select: "firstname lastname email bio gender rank",
        },
      },
    ]),
    getSongs
  );
router
  .route("/:id")
  .delete(protect, authorize("SuperAdmin", "Admin", "Artist"), deleteSong);
router.route("/like").get(protect, likedSongs);
router.route("/like/:id").put(protect, likeSong);
router.route("/play/:id").put(updatePlay);
router.route("/user/comments/:id").put(protect, addComments);

module.exports = router;
