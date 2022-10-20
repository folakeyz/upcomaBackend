const express = require("express");
const {
  createEvent,
  getEvents,
  registerEvent,
} = require("../controllers/Event");
const Event = require("../models/Event");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router
  .route("/")
  .post(protect, authorize("Admin"), createEvent)
  .get(advancedResults(Event), getEvents);
//router.route("/:id").delete(protect, authorize("SuperAdmin"), deleteUser);
router.route("/register/:id").put(protect, registerEvent);

module.exports = router;
