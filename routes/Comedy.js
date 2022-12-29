const express = require("express");
const {
  createComedy,
  getComedys,
  likeComedy,
  likedComedys,
  updatePlay,
  addComments,
} = require("../controllers/Comedy");
const Comedy = require("../models/Comedy");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router
  .route("/")
  .post(protect, authorize("Comedian"), createComedy)
  .get(
    advancedResults(Comedy, [
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
    getComedys
  );
//router.route("/:id").delete(protect, authorize("SuperAdmin"), deleteUser);
router.route("/like").get(protect, likedComedys);
router.route("/like/:id").put(protect, likeComedy);
router.route("/play/:id").put(updatePlay);
router.route("/user/comments/:id").put(protect, addComments);

module.exports = router;
