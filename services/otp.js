const OTP = require("../models/OTP");
//const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");

const generateOTP = async (email) => {
  //const otp = otpGenerator.generate(6, { // USED THIS PACKAGE FIRST BUT IT DOENST SEND ONLY NUMBERS
  //  digits: true,
  //  alphabets: false,
  //  upperCase: false,
  //  specialChars: false,
  //});

  function generateNumericOTP(length = 6) {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join(
      "",
    );
  }
  const otp = generateNumericOTP();

  await OTP.create({ email, otp });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: false,
    auth: {
      user: process.env.COMSCI_LIBRARY_EMAIL,
      pass: process.env.COMSCI_LIBRARY_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.COMSSC_LIBRARY_EMAIL,
    to: email,
    subject: "COMSCI Student Research Paper Library OTP Verification",
    html: `<h3>Your OTP for verification is: <h1>${otp}</h1><br>Use it before it expires.</h3>`,
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

module.exports = { generateOTP, verifyOTP }; // import to auth
