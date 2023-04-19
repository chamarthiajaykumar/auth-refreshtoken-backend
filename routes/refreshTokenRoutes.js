const express = require("express");
const router = express.Router();

const refreshTokenController = require("../controller/refreshTokenController");

router.get("/renewAccessToken", refreshTokenController.handleRefreshToken);

module.exports = router;
