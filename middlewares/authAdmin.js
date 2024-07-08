const verifyAndExtractToken = require("../services/tokenService");

const authAdmin = async (req, res, next) => {
  try {
    const payload = verifyAndExtractToken(
      req.headers.authorization,
      process.env.ADMIN_JWT,
      "Authentication Invalid: Require Admin Permission",
    );
    req.user = { userID: payload.userID, name: payload.name };
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authAdmin;
