const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const emailValidator = require("email-validator");
require("dotenv").config();

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    minlength: 8,
    maxlength: 55,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    minlength: 8,
    maxlength: 55,
    validate: {
      validator: function (email) {
        return emailValidator.validate(email);
      },
      message: "Invalid email format",
    },
    unique: true,
  },
  studentNumber: {
    type: String,
    required: [true, "Please provide a student number"],
    minlength: 10,
    maxlength: 10,
  },
  yearAndSection: {
    type: String,
    required: [true, "Please provide your year and section"],
    minlength: 7,
    maxlength: 7,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
  },
});

// Add confirmPassword as a virtual field
UserSchema.virtual("confirmPassword")
  .get(function () {
    return this._confirmPassword;
  })
  .set(function (value) {
    this._confirmPassword = value;
  });

// Custom validation for password confirmation
UserSchema.pre("validate", function (next) {
  if (this.password !== this.confirmPassword) {
    this.invalidate(
      "confirmPassword",
      "Password and confirm password do not match",
    );
  }
  next();
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userID: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    },
  );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
