const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");

const generateOTP = async (email) => {
  const otp = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: true,
    specialChars: false,
  });

  await OTP.create({ email, otp });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.COMSA_LIBRARY_EMAIL,
      pass: process.env.COMSA_LIBRARY_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.COMSA_LIBRARY_EMAIL,
    to: email,
    subject: "COMSA Research Paper Library OTP Verification",
    html: `<h1>Your OTP for verification is: ${otp}. Use it before it expires.</h1>`,
  });

  return otp;
};

const verifyOTP = async (email, otp) => {
  const otpRecord = await OTP.findOne({ email, otp });
  if (!otpRecord) {
    return false;
  }
  await OTP.deleteOne({ email, otp });
  return true;
};

module.exports = { generateOTP, verifyOTP };
