const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Song = require("../models/Song");
const Trending = require("../models/Trending");

// @desc    Get Liked songs
// @route   GET/api/v1/songs/like/:id
// @access   Public
exports.getTrending = asyncHandler(async (req, res, next) => {
  // get Week
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  const days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil(days / 7);
  const year = currentDate.getFullYear();
  const week = `Week: ${weekNumber} ${year}`;
  const trending = await Trending.find().populate({
    path: "song.songs",
    select: "name album duration genre cover stream artist user",
    populate: {
      path: "user",
      select: "firtsname lastname email bio",
    },
  });

  function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      var result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  }

  const filterTrends = trending?.find((x) => x.song?.week === week);
  const data = filterTrends?.song?.songs.sort(dynamicSort("-stream"));
  // console.log();
  res.status(200).json({
    success: true,
    data,
  });
});
