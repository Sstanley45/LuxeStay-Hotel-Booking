const { StatusCodes } = require("http-status-codes");
const User = require("../../models/user");
const Token = require("../../models/Token");
const { BadRequestError, UnauthenticatedError } = require("../../errors/index");
const { attachCookiesToResponse } = require("../../utils/jwt");
const { createTokenUser } = require("../../utils/createTokenUser");
const crypto = require("crypto");
const sendVerificationToken = require("../../utils/sendVerificationToken");

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("please fill all values");
  }

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("user Already Exists");
  }

  //setup the verificationToken
  const verificationToken = crypto.randomBytes(20).toString("hex");

  const user = await User.create({ name, email, password, verificationToken });

  const origin = "http://localhost:3000/";
  //send back an email telling the user to check email for verification
  await sendVerificationToken({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });

  res.status(StatusCodes.OK).json({
    msg: "success! please check your email for verification",
    // verificationToken:user.verificationToken,
  });

  //---------refactor to add verification first when a user registers---

  //   const tokenUser = createTokenUser(user);

  //   attachCookiesToResponse({ res, tokenUser });
};

//verify email functionality
const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Verification Failed!");
  }
  if (verificationToken !== user.verificationToken) {
    throw new UnauthenticatedError("Verification Failed!");
  }
  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";

  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Email Verified Successfully!" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("please fill all values");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Incorrect Password");
  }
  if (!user.isVerified) {
    throw new UnauthenticatedError("Please verify your email");
  }

  const tokenUser = createTokenUser(user);

  //create refresh Token
  let refreshToken = "";
  //check for existing token if no existing then create token using the Token model

  refreshToken = crypto.randomBytes(20).toString("hex");
  const userRefreshToken = { refreshToken, user: user._id };

  const token = await Token.create(userRefreshToken);

  // attachCookiesToResponse({ res, tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser, token });
};

module.exports = { register, login, verifyEmail };
