const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(StatusCodes.OK).json(users);
};

module.exports = { showCurrentUser, getAllUsers };
