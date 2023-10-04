const express = require('express');
const router = express.Router();

const {
  getAllRooms,
  getSingleRoom,
  createRoom,
} = require("../controllers/roomControllers");

router.get("/getAllRooms", getAllRooms);
router.get("/getSingleRoom/:id", getSingleRoom);
router.post("/createRoom", createRoom);



module.exports = router;