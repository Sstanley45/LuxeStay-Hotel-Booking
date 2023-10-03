const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");
const Token = require("../models/Token");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");
const { attachCookiesToResponse } = require("../utils/jwt");
const { createTokenUser } = require("../utils/createTokenUser");
const crypto = require("crypto");
const sendVerificationToken = require("../utils/sendVerificationToken");
const sendResetPasswordEmail = require("../utils/sendResetPassword");
const createHash = require("../utils/createHash");

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
  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new UnauthenticatedError("Invalid Credentials");
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }

  refreshToken = crypto.randomBytes(20).toString("hex");
  const userRefreshToken = { refreshToken, user: user._id };

  await Token.create(userRefreshToken);

  attachCookiesToResponse({ res, user, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logOut = async (req, res) => {
  await Token.findOneAndDelete({ user: req.user._id });

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(200).json({ msg: "logged out!" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please provide valid email");
  }
  const user = await User.findOne({ email });
  if (user) {
    const passwordToken = crypto.randomBytes(20).toString("hex");
    const tenMinutes = 1000 * 60 * 20;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    //send Email to user;
    const origin = "http://localhost:3000/";
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    });

    //save the above properties to user
    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: "please check your email to reset password" });
};

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;
  if (!token || !email || !password) {
    throw new BadRequestError("please provide all values");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid Email");
  }
  if (user) {
    const currentDate = new Date();
    if (
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      console.log(user);
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }
  res.status(StatusCodes.OK).json({ msg: "password updated", password });
};

module.exports = {
  register,
  login,
  verifyEmail,
  logOut,
  forgotPassword,
  resetPassword,
};
