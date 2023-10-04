const Room = require("../models/room");
const Bookings = require("../models/booking");
const stripe = require("stripe")(
  "sk_test_51NgCdvBTTWsEUllBUUaiU0Us4yeckNxebf5sBCJQazIm2glr1e4vSdPTtB2q35bpLtqECKOSrNsIhAmJiNy0nZBl00Hc71tX91"
);
const { v4: uuidv4 } = require("uuid");
// uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const booking = require("../models/booking");

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

const createRoom = async (req, res) => {
  const {
    name,
    rentperday,
    maxcount,
    description,
    phonenumber,
    type,
    imageurls,
  } = req.body;
  if (!name || !rentperday || !maxcount || !description || !phonenumber || !type || !imageurls) {
    throw new BadRequestError('please fill all values')
  }
  const room = await Room.create({
    name,
    rentperday,
    maxcount,
    description,
    phonenumber,
    type,
    imageurls,
  });

  res.status(StatusCodes.CREATED).json({msg : "success! room Added"})
  
}

////get all bookings
const getAllBookings = async (req, res) => {
  const allBookings = await Bookings.find();
  res.status(StatusCodes.OK).json(allBookings);
}

//bookroom controller & Payment!
const bookRoom = async (req, res) => {
  const {
    room,
    roomId,
    userId,
    fromDate,
    toDate,
    totalAmount,
    totalDays,
    token,
  } = req.body;

  //stripe payment gateway
  //I add the payment logic before booking the room

  //create customer
  const customer = await stripe.customers.create({
    email: token.email,
    source: token.id,
  });
  //create the charge for the customer
  const payment = await stripe.charges.create(
    {
      amount: totalAmount * 100,
      customer: customer.id,
      currency: "KES",
      receipt_email: token.email,
    },
    {
      idempotencyKey: uuidv4(), //so that the customer cannot be charged twice!
    }
  );
  if (payment) {
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
      .json({ msg: "Payment Done! Room booked successfully!", booking });
    return;
  }
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ msg: "An error occurred, try again" });
};

//getBookings for a user

const getUserBookings = async (req, res) => {
  const { userID } = req.body;
  const userBookings = await Bookings.find({ userId: userID });
  if (!userBookings) {
    throw new BadRequestError(`No bookings for user Id : ${userId}`);
  }
  res.status(StatusCodes.OK).json(userBookings);
};

const cancelBooking = async (req, res) => {
  const { bookingId, roomId } = req.body;
  const cancelledBooking = await Bookings.findOne({ _id: bookingId });
  cancelledBooking.status = "cancelled";
  await cancelledBooking.save();
  //secondly we delete the booking from the currentbookings array in the room so as to make it available during filtering.
  const roomWithTheCancelledBooking = await Room.findOne({ _id: roomId });
  //grab the currentBooking array of the room
  const currentBookingsOfRoom = roomWithTheCancelledBooking.currentbookings;
  const filteredCurrentBookings = currentBookingsOfRoom.filter(
    (booking) => booking.bookingId.toString() !== bookingId
  );
  roomWithTheCancelledBooking.currentbookings = filteredCurrentBookings;
  await roomWithTheCancelledBooking.save();
  res.status(StatusCodes.OK).json({ msg: "booking cancelled successfully!" });
};

module.exports = {
  getAllRooms,
  getSingleRoom,
  bookRoom,
  getUserBookings,
  cancelBooking,
  getAllBookings,
  createRoom,
};
