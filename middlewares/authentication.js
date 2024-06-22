//const User = require("../models/User");
const { UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  console.log("headers auth: ", req.headers.authorization);

  const token = req.cookies.token; // Read token from cookies
  if (!token) {
    throw new UnauthenticatedError("Authentication Invalid: No Token Provided");
  }
  // check the headers
  //const authHeader = req.headers.authorization;
  //if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //  throw new UnauthenticatedError("Authentication Invalid: No Token Provided");
  //}
  //const token = authHeader.split(" ")[1];
  try {
    // verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("payload:", payload);
    // attach the user to the -
    req.user = { userID: payload.userID, name: payload.name };
    next();
  } catch (error) {
    console.error(error);
    throw new UnauthenticatedError(
      "Authentication Invalid: Token Not Authorized",
    );
  }
};

module.exports = auth;
