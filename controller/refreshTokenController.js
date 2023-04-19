const jwt = require("jsonwebtoken");
const User = require("./../model/userModel");

exports.handleRefreshToken = (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);

  const userRefreshToken = cookies.jwt;

  const user = User.findOne({ refreshToken: userRefreshToken });

  if (!user) {
    return res.sendStatus(403); // ForBidden
  }

  jwt.verify(
    userRefreshToken,
    process.env.JWT_REFRESH_SECRET,
    (err, decoded) => {
      if (err) return res.sendStatus(403);
      const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      res.json({
        accessToken,
      });
    }
  );
};
