const express = require('express');
const router = express.Router();

const {
  getAllRooms,
  getSingleRoom,
} = require("../controllers/roomControllers");

router.get("/getAllRooms", getAllRooms);
router.get("/getSingleRoom/:id", getSingleRoom);



module.exports = router;