const express = require("express");
const {
  createBooking,
  getBookings,
  myBooking,
  talentBooking,
} = require("../controllers/Booking");
const Booking = require("../models/Booking");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router
  .route("/")
  .post(protect, createBooking)
  .get(protect, advancedResults(Booking), getBookings);
router.route("/me").get(protect, myBooking);
router.route("/talents").get(protect, talentBooking);
//router.route("/:id").delete(protect, authorize("SuperAdmin"), deleteUser);

module.exports = router;
