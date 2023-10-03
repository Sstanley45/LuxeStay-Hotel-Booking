const express = require("express");

const router = express.Router();

const { bookRoom } = require("../controllers/roomControllers");

router.post("/bookroom", bookRoom);

module.exports = router;
