const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const config = require("../config");
const AppError = require("../errors/AppError");
const User = require("../model/userModel");

const protect = (...requiredRoles) => {
  return catchAsync(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    const token = authHeader.split(" ")[1];

    let decoded;

    try {
      decoded = jwt.verify(token, config.Jwt_access_secret);
    } catch (error) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const isUserExist = await User.find({ email: decoded?.email });

    if (!isUserExist) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "User not found. Please register"
      );
    }

    req.user = decoded;
    next();
  });
};

module.exports = protect;
