// user schema

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required!"],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
    },
    profile: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    role: {
      type: Number,
      enum: [0, 1],
      default: 0, 
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    authToken: {
      type: String,
      default: "",
    },
    refreshToken: {
      type: String,
      default: "",
    },
    otp: {
      type: Number
    },
    otpExpires: {
        type :Number
    },
  },
  {
    timestamps: true,
  }
);

 module.exports = mongoose.model("User", userSchema);

