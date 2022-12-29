const express = require("express");
const {
  getTrendingSong,
  getStreams,
  getTrending,
  getTopTalents,
} = require("../controllers/Stream");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");
const Stream = require("../models/Stream");

const router = express.Router();

router.route("/").get(
  advancedResults(Stream, {
    path: "song",
    select:
      "name artist duration cover genre stream rating comments numReviews",
  }),
  getStreams
);
router.route("/songs").get(getTrendingSong);
router.route("/all").get(getTrending);
router.route("/talents").get(getTopTalents);
// router.route("/like").get(protect, likedSongs);
// router.route("/like/:id").put(protect, likeSong);
// router.route("/play/:id").put(updatePlay);

module.exports = router;
