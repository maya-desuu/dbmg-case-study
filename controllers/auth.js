const User = require("../models/User");
const { UnauthenticatedError, BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  //console.log(req.body);
  const user = await User.create(req.body);
  const token = user.createJWT;
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email or password");
  }

  // check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  // compare password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
