const mongoose = require("mongoose");

const admins = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const admin = mongoose.model("admins", admins);

module.exports = admin;
