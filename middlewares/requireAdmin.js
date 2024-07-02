const { UnauthenticatedError } = require("../errors");

const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    throw new UnauthenticatedError("Admin access required");
  }
  next();
};

module.exports = requireAdmin;
