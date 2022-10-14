const express = require("express");
const { createSong, getSongs } = require("../controllers/Song");
const Song = require("../models/Song");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router
  .route("/")
  .post(protect, authorize("Artist", "DJ", "Producer", "Label"), createSong)
  .get(
    protect,
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

module.exports = router;
