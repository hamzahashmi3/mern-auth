const mongoose = require("mongoose");

// schema
const userVerificationSchema = new mongoose.Schema({
    userId: String,
    uniqueString: String,
    createdAt: Date,
    expiresAt: Date
})

module.exports = mongoose.model("UserVerification", userVerificationSchema)