const express = require("express");
const { createEvent, getEvents } = require("../controllers/Event");
const Event = require("../models/Event");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router
  .route("/")
  .post(protect, authorize("Admin"), createEvent)
  .get(protect, advancedResults(Event), getEvents);
//router.route("/:id").delete(protect, authorize("SuperAdmin"), deleteUser);

module.exports = router;
