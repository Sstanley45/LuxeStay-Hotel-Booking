const express = require("express");

const router = express.Router();

const {
  bookRoom,
  getUserBookings,
  cancelBooking,
  getAllBookings,
} = require("../controllers/roomControllers");


router.get("/getAllBookings", getAllBookings);
router.post("/bookroom", bookRoom);
router.post("/userBookings", getUserBookings);
router.post("/cancelBooking", cancelBooking);

module.exports = router;
