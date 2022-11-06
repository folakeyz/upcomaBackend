const express = require("express");
const { createAlbum, getAlbums } = require("../controllers/Album");
const Album = require("../models/Album");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router
  .route("/")
  .post(protect, authorize("Artist", "DJ", "Producer", "Label"), createAlbum)
  .get(
    advancedResults(Album, [
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
    getAlbums
  );
//router.route("/:id").delete(protect, authorize("SuperAdmin"), deleteUser);

module.exports = router;
