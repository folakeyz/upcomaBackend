const express = require("express");
const {
  createBanner,
  getBanner,
  updateBanner,
  deleteBanner,
} = require("../controllers/Banner");
const Banner = require("../models/Banner");
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");
const router = express.Router();

router
  .route("/")
  .post(protect, authorize("SuperAdmin", "Admin"), createBanner)
  .get(advancedResults(Banner), getBanner);
router
  .route("/:id")
  .delete(protect, authorize("SuperAdmin", "Admin"), deleteBanner)
  .put(updateBanner);

module.exports = router;
