//To use this in your frontend:
//
//Call /initiate-registration with the email.
//Once the user receives the OTP, call /verify-otp with the email and OTP.
//Use the returned tempToken along with the rest of the user data to call /complete-registration.

const User = require("../models/User");
const { UnauthenticatedError, BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const otpService = require("../services/otp");

// Validate user input against schema
const validateUserInput = async (req, res) => {
  const newUser = new User(req.body);
  try {
    await newUser.validate(); // Validate input against the schema
    res.status(StatusCodes.OK).json({ message: "Input is valid." });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

// Initiate registration process by generating OTP and sending it
const initiateRegistration = async (req, res) => {
  const { email } = req.body;

  try {
    await otpService.generateOTP(email);
    res.status(StatusCodes.OK).json({ msg: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error initiating registration" });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const isValid = await otpService.verifyOTP(email, otp);
    if (!isValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid OTP" });
    }

    // Generate a temporary token and store it globally
    const tempToken = generateTempToken();
    global.tempTokens = global.tempTokens || {};
    global.tempTokens[tempToken] = email;

    res
      .status(StatusCodes.OK)
      .json({ msg: "OTP verified successfully", tempToken });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error verifying OTP" });
  }
};

// Complete registration process using the temporary token and user data
const completeRegistration = async (req, res) => {
  const { tempToken, ...userData } = req.body;

  // Check if the temporary token is valid and retrieve associated email
  if (!global.tempTokens || !global.tempTokens[tempToken]) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "Invalid or expired token" });
  }

  const email = global.tempTokens[tempToken];
  delete global.tempTokens[tempToken];

  try {
    // Ensure the email from userData matches the verified email
    if (email !== userData.email) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Email mismatch" });
    }

    // Create the user in the database
    const user = await User.create(userData);

    // Generate JWT token for authentication
    //const token = user.createJWT();

    // Respond with user details and token
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error completing registration" });
  }
};

// Generate a temporary token for registration process
function generateTempToken() {
  return Math.random().toString(36).substr(2, 10);
}

// Login endpoint for existing users
const login = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate presence of required fields
  if (!email || !password || !name) {
    throw new BadRequestError("Please Provide Email, Name, And Password");
  }

  // Check if user exists in the database
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("User Not Found");
  }

  // Compare password with hashed password in the database
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Incorrect Password");
  }

  // Check if the user is an admin based on email (not yet implemented, so no usecase as of now)
  let isAdmin = false;
  if (user.email === process.env.ADMIN_EMAIL) {
    isAdmin = true;
  }

  // Generate JWT token for user authentication
  const token = user.createJWT();

  // Respond with user details and token
  res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name, isAdmin }, token });
};

module.exports = {
  validateUserInput,
  initiateRegistration,
  verifyOTP,
  completeRegistration,
  login,
};
