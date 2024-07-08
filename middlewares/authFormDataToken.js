const { StatusCodes } = require("http-status-codes");
const verifyAndExtractToken = require("../services/tokenService");

const authFormDataToken = (req, res, next) => {
  try {
    const decoded = verifyAndExtractToken(
      req.headers.authorization,
      process.env.FORM_DATA_JWT,
      "Invalid form data token",
    );
    req.formDataId = decoded.formDataId;
    next();
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
  }
};

module.exports = authFormDataToken;
