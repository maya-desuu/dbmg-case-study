const express = require("express");
const router = express.Router();

const {
  initiateRegistration,
  verifyOTP,
  completeRegistration,
  validateUserInput,
  login,
} = require("../controllers/auth");
const { authentication } = require("../middlewares/authentication");

router.post("/validate-user-input", validateUserInput);
router.post("/initiate-registration", initiateRegistration);
router.post("/verify-otp", verifyOTP);
router.post("/complete-registration", completeRegistration);
router.post("/login", login);

//router.post("/register", register);

module.exports = router;
