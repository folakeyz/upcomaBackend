const express = require("express");
const {
  createEvent,
  getEvents,
  registerEvent,
  deleteEvent,
  getSingleEvent,
  updateEvent,
  myEvents,
} = require("../controllers/Event");
const Event = require("../models/Event");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router
  .route("/")
  .post(protect, authorize("Admin", "Producer", "Label"), createEvent)
  .get(
    advancedResults(Event, {
      path: "attendees",
      select: "firstname lastname email bio gender rank",
    }),
    getEvents
  );
router.route("/myEvents").get(protect, myEvents);
router
  .route("/:id")
  .delete(protect, authorize("Admin"), deleteEvent)
  .get(getSingleEvent)
  .put(protect, updateEvent);

router.route("/register/:id").put(protect, registerEvent);

module.exports = router;
