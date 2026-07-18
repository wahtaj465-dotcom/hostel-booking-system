const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },

  // ✅ role added for RBAC
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  // ✅ OTP fields for email-based login/signup verification.
  // Store only a hashed OTP so the plain code never remains in the DB.
  otp: {
    type: String,
    default: null,
    select: false,
  },
  otpExpiresAt: {
    type: Date,
    default: null,
    select: false,
  },
  otpPurpose: {
    type: String,
    enum: ["login", "signup", null],
    default: null,
    select: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);