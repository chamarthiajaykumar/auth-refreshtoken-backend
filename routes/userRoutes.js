const express = require("express");
const router = express.Router();

const authController = require("../controller/authController");
const userController = require("./../controller/userController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/getAllUsers", authController.protect, userController.getAllUsers);

module.exports = router;
