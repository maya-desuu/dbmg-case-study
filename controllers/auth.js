const User = require("../models/User");
require("dotenv").config();
const { UnauthenticatedError, BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const validateUserInput = async (req, res) => {
  const newUser = new User(req.body);

  try {
    await newUser.validate(); // Validate input against the schema
    res.status(StatusCodes.OK).json({ message: "Input is valid." });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const register = async (req, res) => {
  const user = await User.create(req.body);
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    throw new BadRequestError("Please Provide Email, Name, And Password");
  }

  // check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("User Not Found");
  }

  // compare password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Incorrect Password");
  }

  //console.log(user.email);
  //console.log(process.env.ADMIN_EMAIL);

  let isAdmin = false;
  if (user.email === process.env.ADMIN_EMAIL) {
    isAdmin = true;
  }

  token = user.createJWT();
  res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name, isAdmin: isAdmin }, token });
};

module.exports = {
  validateUserInput,
  register,
  login,
};
