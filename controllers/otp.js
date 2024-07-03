//const OTP = require("../models/OTP");
//const otpGenerator = require("otp-generator");
//const nodemailer = require("nodemailer");
//const { StatusCodes } = require("http-status-codes");
//
//const generateOTP = async (req, res) => {
//  const { email } = req.body;
//
//  const otp = otpGenerator.generate(6, {
//    digits: true,
//    alphabets: false,
//    upperCase: true,
//    specialChars: false,
//  });
//
//  try {
//    await OTP.create({ email, otp });
//
//    const transporter = nodemailer.createTransport({
//      service: "gmail",
//      host: "smtp.gmail.com",
//      port: 465,
//      secure: true,
//      auth: {
//        user: process.env.COMSA_LIBRARY_EMAIL,
//        pass: process.env.COMSA_LIBRARY_PASSWORD,
//      },
//    });
//
//    await transporter.sendMail({
//      from: process.env.COMSA_LIBRARY_EMAIL,
//      to: email,
//      subject: "COMSA Research Paper Library OTP Verification",
//      html: `<h1>Your OTP for verification is: ${otp}. Use it before it expires.</h1>`,
//    });
//
//    res.status(StatusCodes.OK).send("OTP sent successfully");
//  } catch (error) {
//    console.error(error);
//    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error sending OTP");
//  }
//};
//
//const verifyOTP = async (req, res) => {
//  const { email, otp } = req.body;
//
//  try {
//    const otpRecord = await OTP.findOne({ email, otp }).exec();
//
//    if (otpRecord) {
//      res.status(StatusCodes.OK).send("OTP verified successfully");
//    } else {
//      res.status(StatusCodes.BAD_REQUEST).send("Invalid OTP");
//    }
//  } catch (error) {
//    console.error(error);
//    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error verifying OTP");
//  }
//};
//
//module.exports = { generateOTP, verifyOTP };
