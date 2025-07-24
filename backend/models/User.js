const e = require("express");
const { verify } = require("jsonwebtoken");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    verifyOtp: {
        type: String,
        default: null
    },
    verifyOtpExpires: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetOtp: {
        type: String,
        default: null
    },
    resetOtpExpires: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        enum: ["student", "admin", "parent", "teacher"],
        required: true
    },
});

const User = mongoose.models.User|| mongoose.model("User", userSchema);

module.exports = User;
