const express = require("express");
const router = express.Router();

const {
  validateUserInput,
  generateOTP,
  verifyOTP,
  register,
  login,
} = require("../controllers/auth");

const { authentication } = require("../middlewares/authentication");

router.post("/validate-user-input", validateUserInput);
router.post("/generate-otp", generateOTP);
router.post("/verify-otp", verifyOTP);
router.post("/register", register);
router.post("/login", login);

//router.post("/register", register);

module.exports = router;
