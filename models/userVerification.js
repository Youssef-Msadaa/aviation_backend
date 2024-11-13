const mongoose = require("mongoose");

const UserVerificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    require: true,
    ref: "user",
    unique: true,
  },
  uniqueString: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  expiresAt: {
    type: Date,
    default: Date.now() + 180000,
  },
});

const UserVerification = mongoose.model(
  "UserVerification",
  UserVerificationSchema
);

module.exports = UserVerification;
