const User = require("../models/users");
const UserVerification = require("../models/userVerification");
const sendVerificationEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, gender, country, phone, email, password } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({
      firstname,
      lastname,
      gender,
      country,
      phone,
      email,
      password,
      verified: false,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    newUser.password = hashedPassword;
    await newUser.save();

    // Generate unique verification string
    const uniqueString = crypto.randomBytes(32).toString("hex");

    // Save verification record
    const newVerification = new UserVerification({
      userId: newUser._id,
      uniqueString,
      expiresAt: Date.now() + 1800000, // 30 minutes
    });
    await newVerification.save();

    // Send verification email
    await sendVerificationEmail(email, uniqueString);

    res.status(201).json({
      message:
        "User registered. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "An error occurred during registration", error });
  }
};

const verifyEmail = async (req, res) => {
  const { uniqueString } = req.params;

  try {
    const record = await UserVerification.findOne({ uniqueString });

    if (!record || record.expiresAt < Date.now()) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification link" });
    }

    const user = await User.findById(record.userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.verified = true;
    await user.save();

    await UserVerification.deleteOne({ uniqueString });

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "An error occurred during verification", error });
  }
};

module.exports = { registerUser, verifyEmail };
