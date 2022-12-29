const express = require("express");
const {
  createDJ,
  getDJs,
  likeDJ,
  likedDJs,
  updatePlay,
  addComments,
} = require("../controllers/DJ");
const DJ = require("../models/DJ");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router
  .route("/")
  .post(protect, authorize("Comedian", "DJ"), createDJ)
  .get(
    advancedResults(DJ, [
      {
        path: "user",
        select: "firstname lastname email bio stagename rank",
      },
      {
        path: "comments",
        populate: {
          path: "user",
          select: "firstname lastname email bio gender rank",
        },
      },
    ]),
    getDJs
  );
//router.route("/:id").delete(protect, authorize("SuperAdmin"), deleteUser);
router.route("/like").get(protect, likedDJs);
router.route("/like/:id").put(protect, likeDJ);
router.route("/play/:id").put(updatePlay);
router.route("/user/comments/:id").put(protect, addComments);

module.exports = router;
