const express = require("express");
const { createChat, getChats } = require("../controllers/Chat");

const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").post(protect, createChat);

router.route("/:id").get(protect, getChats);

module.exports = router;
