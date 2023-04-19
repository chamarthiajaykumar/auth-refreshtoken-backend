const User = require("./../model/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

require("dotenv").config();

const signAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

const cookieOptions = {
  expires: new Date(Date.now() + 86400000),
  httpOnly: true,
};

const createSendToken = (user, refreshToken, statusCode, res) => {
  const accessToken = signAccessToken(user._id);

  // Production set secure flag as true

  //   if (process.env.NODE_ENV === "production") {
  //     cookieOptions.secure = true;
  //   }

  res.cookie("jwt", refreshToken, cookieOptions);

  // Remove the password
  user.password = undefined;
  user.refreshToken = undefined;

  res.status(statusCode).json({
    status: "success",
    accessToken,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const emailCheck = await User.findOne({ email });

  if (emailCheck) {
    return next(new AppError("User with this Email already in use", 400));
  }

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  const refreshToken = signRefreshToken(newUser._id);

  newUser.refreshToken = refreshToken;

  await newUser.save({ validateBeforeSave: false });

  createSendToken(newUser, refreshToken, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log(email, password);

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  const correct = await user.correctPassword(password, user.password);

  if (!user || !correct) {
    return next(new AppError("Incorrect email and password", 401));
  }

  const refreshToken = signRefreshToken(user._id);

  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  createSendToken(user, refreshToken, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError(`Yor'e not logged in! Please Login`, 401));
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user still exist
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    next(new AppError(`The token belonging to the user doesn't exist`, 401));
  }

  console.log("user is present");

  // GRANT ACCESS
  req.user = freshUser;
  next();
});
