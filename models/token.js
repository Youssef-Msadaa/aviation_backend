const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "2h" }, // Automatically delete after 2 hours
});

const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;
