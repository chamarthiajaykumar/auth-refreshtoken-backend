const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/appError");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());

app.use(express.json());

app.use(cookieParser());

const logoutRoutes = require("./routes/logoutRoutes");
const refreshTokenRoutes = require("./routes/refreshTokenRoutes");
const userRoutes = require("./routes/userRoutes");
const globalErrorHandler = require("./controller/errorController");

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/refreshToken", refreshTokenRoutes);
app.use("/api/v1/users", logoutRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Auth Refresh Token App",
  });
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
