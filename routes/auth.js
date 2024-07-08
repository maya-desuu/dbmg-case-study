const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const {
  validateUserInput,
  generateOTP,
  verifyOTP,
  register,
  login,
} = require("../controllers/auth");

//const { authentication } = require("../middlewares/authentication");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 requests per 15 minutes
  message: "Too many authentication attempts, please try again later.",
});

router.post("/validate-user-input", validateUserInput);
router.post("/generate-otp", generateOTP);
router.post("/verify-otp", verifyOTP);
router.post("/register", register);
router.post("/login", authLimiter, login); // limit attempts when logging in (protection against bruteforce ig)

//router.post("/register", register);

module.exports = router;
