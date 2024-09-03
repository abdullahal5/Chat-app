const httpStatus = require("http-status");
const UserModel = require("../../model/userModel");
const SendResponse = require("../../utils/SendResponse");
const AppError = require("../../errors/AppError");
const catchAsync = require("../../utils/catchAsync");
const config = require("../../config");
const { createToken, verifyToken } = require("../../utils/token");
const { uploadImageToImgBB } = require("../../utils/imageUploadToCloudinary");

const registerUser = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError(httpStatus.NOT_FOUND, "Please, Fill all the fields");
  }

  const isUserExist = await UserModel.findOne({ email });
  if (isUserExist) {
    throw new AppError(httpStatus.CONFLICT, "Email already exist!");
  }

  let profilePic;

  if (req.file) {
    const { data } = await uploadImageToImgBB(req.file.path);
    profilePic = data?.display_url;
  }

  const result = await UserModel.create({
    name,
    email,
    password,
    pic: profilePic,
  });

  const jwtPayload = {
    userId: result._id,
    name: result.name,
    email: result.email,
    isAdmin: result.isAdmin,
    pic: result.pic,
  };

  const accessToken = createToken(
    jwtPayload,
    config.Jwt_access_secret,
    config.Jwt_access_expires_in
  );

  const refreshToken = createToken(
    jwtPayload,
    config.Jwt_refresh_secret,
    config.Jwt_refresh_expires_in
  );

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production" ? true : false,
    httpOnly: true,
  });

  if (result) {
    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Created Successfully",
      data: result,
      token: accessToken,
    });
  }
});

const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please, Fill all the fields");
  }

  const isUserExist = await UserModel.findOne({ email });
  if (!isUserExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Email doesn't exist. Please, Sign up first"
    );
  }

  const jwtPayload = {
    userId: isUserExist._id,
    name: isUserExist.name,
    email: isUserExist.email,
    isAdmin: isUserExist.isAdmin,
    pic: isUserExist.pic,
  };

  const accessToken = createToken(
    jwtPayload,
    config.Jwt_access_secret,
    config.Jwt_access_expires_in
  );

  const refreshToken = createToken(
    jwtPayload,
    config.Jwt_refresh_secret,
    config.Jwt_refresh_expires_in
  );

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production" ? true : false,
    httpOnly: true,
  });

  if (jwtPayload) {
    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Logged In Successfully",
      data: accessToken,
    });
  }
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const decoded = verifyToken(refreshToken, config.Jwt_refresh_secret);

  const isUserExist = await UserModel.findOne({ email: decoded?.email });

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found. Please register");
  }

  const jwtPayload = {
    userId: isUserExist?._id,
    name: isUserExist?.name,
    email: isUserExist?.email,
    isAdmin: isUserExist?.isAdmin,
    pic: isUserExist?.pic,
  };

  const accessToken = createToken(
    jwtPayload,
    config.Jwt_access_secret,
    config.Jwt_access_expires_in
  );

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token is retrieved succesfully!",
    data: accessToken,
  });
});

const allUser = catchAsync(async (req, res) => {
  const query = req?.query?.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const result = await UserModel.find(query).find({
    _id: { $ne: req.user.userId },
  });

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Retrieved Successfully",
    data: result,
  });
});

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  allUser,
};
