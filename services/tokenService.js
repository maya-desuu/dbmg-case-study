const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const verifyAndExtractToken = (authHeader, secret, errorMessage) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication Invalid: No Token Provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new UnauthenticatedError(
      errorMessage || "Authentication Invalid: Token Not Authorized",
    );
  }
};

module.exports = verifyAndExtractToken;
