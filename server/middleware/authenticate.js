const { UnauthenticatedError } = require("../errors");
const { isTokenValid, attachCookiesToResponse } = require("../utils/jwt");
const Token = require("../models/Token");

const authenticateUser = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies;
  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }
    //if the accessToken is not present
    const payload = isTokenValid(refreshToken);
    const existingToken = await Token.findOne({
      user: payload.user,
      refreshToken: payload.refreshToken,
    });
    //check if existing token exists and if it does exists, whats the value of isValid? if false throw error;

    if (!existingToken || !existingToken?.isValid) {
      throw new UnauthenticatedError("Authentication Invalid");
    }
    //if successful.. pass on the user, next, and attach cookies so that if the accessToken is expired and the refreshToken is present we still generate both cookies
    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });
    req.user = payload.user;
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
};

//I will have to modify what i pass in the JWT so that I include the role to make it accessible in the req.user
const unauthorizedPermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthenticatedError("Unauthorized to access this route");
    }
    next();
  };
};

module.exports = authenticateUser;
