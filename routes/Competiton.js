const express = require("express");
const {
  createCompetiton,
  getCompetitons,
  registerCompetiton,
  deleteCompetiton,
  getSingleCompetiton,
  updateCompetiton,
} = require("../controllers/Competiton");
const Competiton = require("../models/Competiton");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router
  .route("/")
  .post(protect, authorize("Admin", "Producer", "Label"), createCompetiton)
  .get(advancedResults(Competiton), getCompetitons);
router
  .route("/:id")
  .delete(protect, authorize("Admin"), deleteCompetiton)
  .get(getSingleCompetiton)
  .put(protect, updateCompetiton);
router.route("/register/:id").put(protect, registerCompetiton);

module.exports = router;
