const express = require("express");
const {
  createBeat,
  getBeats,
  likeBeat,
  likedBeats,
  updatePlay,
  addComments,
  buyBeat,
} = require("../controllers/Beat");
const Beat = require("../models/Beat");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router
  .route("/")
  .post(protect, authorize("Artist", "DJ", "Producer", "Label"), createBeat)
  .get(
    advancedResults(Beat, [
      {
        path: "user",
        select: "firstname lastname email bio rank stagename",
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
    getBeats
  );
//router.route("/:id").delete(protect, authorize("SuperAdmin"), deleteUser);
router.route("/like").get(protect, likedBeats);
router.route("/like/:id").put(protect, likeBeat);
router.route("/play/:id").put(updatePlay);
router.route("/user/comments/:id").put(protect, addComments);
router.route("/buy/new/beat/:id").put(protect, buyBeat);

module.exports = router;
