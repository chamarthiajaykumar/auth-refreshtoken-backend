const User = require("./../model/userModel");

exports.logout = async (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); // No Content

  const userRefreshToken = cookies.jwt;

  // Is refreshToken in db?

  const user = await User.findOne({ refreshToken: userRefreshToken });

  if (!user) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204); // No Content
  }

  // Delete refreshToken in db?
  user.refreshToken = "";

  await user.save({ validateBeforeSave: false });
  res.clearCookie("jwt", { httpOnly: true }); // In Production -> secure: true
  res.sendStatus(204);
};
