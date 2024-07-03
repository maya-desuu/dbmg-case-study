const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const authFormDataToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    jwt.verify(bearerToken, process.env.FORM_DATA_TOKEN, (err, decoded) => {
      if (err) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ error: "Invalid token" });
      }
      req.formDataId = decoded.formDataId;
      next();
    });
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: "Token is required" });
  }
};

module.exports = authFormDataToken;
