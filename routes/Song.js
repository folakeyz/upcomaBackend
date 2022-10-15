const express = require("express");
const {
  createSong,
  getSongs,
  likeSong,
  likedSongs,
  updatePlay,
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
        select: "firtsname lastname email bio",
      },
      {
        path: "genre",
        select: "name ",
      },
    ]),
    getSongs
  );
//router.route("/:id").delete(protect, authorize("SuperAdmin"), deleteUser);
router.route("/like").get(protect, likedSongs);
router.route("/like/:id").put(protect, likeSong);
router.route("/play/:id").put(updatePlay);

module.exports = router;
