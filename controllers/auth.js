const User = require("../models/User");
require("dotenv").config();
const { UnauthenticatedError, BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  //console.log(req.bod);
  const user = await User.create(req.body);
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

//const register = async (req, res) => {
//  try {
//    const user = await User.create(req.body);
//    const token = user.createJWT();
//    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
//  } catch (error) {
//    console.error(error);
//    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
//  }
//};

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

  // check if admin
  let isAdmin = false;
  if (user._id.toString() === process.env.ADMIN_ID) {
    isAdmin = true;
  }

  // create and send token to client
  token = user.createJWT();
  if (token) {
    res
      .status(StatusCodes.OK)
      .json({ user: { name: user.name, isAdmin }, token });
  }
};

module.exports = {
  register,
  login,
};
