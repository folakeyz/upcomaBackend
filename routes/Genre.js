const express = require("express");
const {
  createGenre,
  getGenres,
  deleteGenre,
  updateGenre,
} = require("../controllers/Genre");
const Genre = require("../models/Genre");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router
  .route("/")
  .post(protect, authorize("Admin"), createGenre)
  .get(protect, advancedResults(Genre), getGenres);
router
  .route("/:id")
  .delete(protect, authorize("SuperAdmin", "Admin"), deleteGenre)
  .put(protect, updateGenre);

module.exports = router;
