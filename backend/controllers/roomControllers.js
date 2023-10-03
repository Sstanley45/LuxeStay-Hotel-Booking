const Room = require("../models/room");
const Bookings = require("../models/booking");

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

const bookRoom = async (req, res) => {
  const { room, roomId, userId, fromDate, toDate, totalAmount, totalDays } =
    req.body;
  const booking = await Bookings.create({
    room,
    roomId,
    userId,
    fromDate,
    toDate,
    totalAmount,
    totalDays,
    transactionId: "1234",
  });

  //we have to do one more thing after booking a room we have to update the currentbooking array of the respective room;
  //in the room model we have a currentbooking property. if a room is booked we add its details to the currentbookings.

  //first get the room using the the room id
  const roomTemp = await Room.findOne({ _id: roomId });
  roomTemp.currentbookings.push({
    bookingId: booking._id,
    fromDate,
    toDate,
    userId,
    status: booking.status,
  });
  await roomTemp.save();
  res
    .status(StatusCodes.OK)
    .json({ msg: "Room booked successfully!", booking });
};

module.exports = { getAllRooms, getSingleRoom, bookRoom };
