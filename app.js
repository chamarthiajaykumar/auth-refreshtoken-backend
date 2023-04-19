const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

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
    message: "Welcome to the practise App",
  });
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
