const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: [true, "Email already in use"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, "Please provide a password"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please provide a confirm password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not same",
    },
  },
  refreshToken: { type: String },
});

userSchema.pre("save", async function (next) {
  //this points to the current user object

  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
