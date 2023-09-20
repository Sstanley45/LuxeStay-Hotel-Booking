const Room = require("../models/room");
const { StatusCodes } = require("http-status-codes");

const getAllRooms = async (req, res) => {
  const rooms = await Room.find({});
  res.status(StatusCodes.OK).json(rooms);
};

const getSingleRoom = async (req, res) => {
  const { id: roomId } = req.params;
  const room = await Room.findOne({ _id: roomId });
  if (!room) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `no room with id : ${roomId}` });
  }

  res.status(StatusCodes.OK).json(room);
};

module.exports = { getAllRooms, getSingleRoom };
