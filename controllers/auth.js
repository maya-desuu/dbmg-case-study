const User = require("../models/User");
const { UnauthenticatedError, BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

//const register = async (req, res) => {
//  console.log("Starting registration...");
//  try {
//    const user = await User.create(req.body);
//    console.log("User created successfully:", user);
//    const token = user.createJWT();
//    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
//  } catch (error) {
//    console.error(error);
//    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err: error });
//  }
//};

const register = async (req, res) => {
  console.log(req.body);
  const user = await User.create(req.body);
  const token = user.createJWT;
  res.status(StatuesCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email or password");
  }
  const user = await User.findOne({ email });

  // check if user exists
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

//const login = async (req, res) => {
//  try {
//    const { email, password } = req.body;
//
//    if (!email || !password) {
//      throw new BadRequestError("Please provide email or password");
//    }
//
//    const user = await User.findOne({ email });
//
//    // check if user exists
//    if (!user) {
//      throw new UnauthenticatedError("Invalid credentials");
//    }
//
//    // compare password
//    const isPasswordCorrect = await user.comparePassword(password);
//    if (!isPasswordCorrect) {
//      throw new UnauthenticatedError("Invalid credentials");
//    }
//
//    const token = user.createJWT();
//    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
//  } catch (err) {
//    console.error(err);
//    res.status(500).json({ error: "Internal Server Error" });
//  }
//};

module.exports = {
  register,
  login,
};
