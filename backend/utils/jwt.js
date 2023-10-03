const jwt = require("jsonwebtoken");

const oneHour = 1000;
const oneMonth = 1000 * 60 * 60 * 24 * 30;

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET); //I don't set up the expiration because its included in the cookie.
  return token;
};

//we attach two cookies.. one for accessToken and the other for refresh token
const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  //Create the JWTTokens using the args passed
  const accessTokenJWT = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({ payload: { refreshToken, user } });

  //Create the two cookies

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    maxAge : 1000,
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    expiresIn: new Date(Date.now() + oneMonth),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = { attachCookiesToResponse, isTokenValid };
