const express = require("express");
const { userChart } = require("../controllers/Analytics");
const { protect, authorize } = require("../middleware/auth");
const router = express.Router();

router.route("/").get(protect, userChart);

module.exports = router;
