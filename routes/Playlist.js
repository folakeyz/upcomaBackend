const express = require("express");
const {
  createPlaylist,
  getPlaylist,
  addSongToPlaylist,
} = require("../controllers/Playlist");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");
const Playlist = require("../models/Playlist");

const router = express.Router();

router
  .route("/")
  .post(protect, createPlaylist)
  .get(
    advancedResults(Playlist, [
      {
        path: "song",
        select:
          "name artist duration cover genre stream rating comments numReviewa",
      },
      {
        path: "user",
        select: "firstname lastname role ",
      },
    ]),
    getPlaylist
  );
router.route("/:id").put(protect, addSongToPlaylist);

module.exports = router;
