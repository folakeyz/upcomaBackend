const express = require("express");
const { getTrending } = require("../controllers/Trending");
const Song = require("../models/Song");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router.route("/").get(getTrending);
//router.route("/:id").delete(protect, authorize("SuperAdmin"), deleteUser);
// router.route("/like").get(protect, likedSongs);
// router.route("/like/:id").put(protect, likeSong);
// router.route("/play/:id").put(updatePlay);

module.exports = router;
