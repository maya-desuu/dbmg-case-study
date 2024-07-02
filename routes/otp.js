const express = require("express");
const { generateOTP, verifyOTP } = require("../controllers/otp");
const router = express.Router();

router.post("/generate-otp", generateOTP);
router.post("/verify-otp", verifyOTP);

module.exports = router;
