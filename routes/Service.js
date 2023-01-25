const express = require("express");
const { createService, getServices } = require("../controllers/Service");
const Service = require("../models/Service");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router
  .route("/")
  .post(protect, createService)
  .get(
    advancedResults(Service, [
      {
        path: "user",
        select: "firstname lastname role rank",
      },
    ]),
    getServices
  );
//router.route("/:id").delete(protect, authorize("SuperAdmin"), deleteUser);

module.exports = router;
