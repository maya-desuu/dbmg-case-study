const verifyAndExtractToken = require("../services/tokenService");

const authUser = async (req, res, next) => {
  try {
    const payload = verifyAndExtractToken(
      req.headers.authorization,
      process.env.USER_JWT,
      "Authentication Invalid: Token Not Authorized",
    );
    req.user = { userID: payload.userID, name: payload.name };
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authUser;
