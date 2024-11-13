const express = require("express");
const router = express.Router();
const user = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const Token = require("../models/token");
const { registerUser, verifyEmail } = require("../routes/userController");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("Unauthorized");

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).send("Unauthorized");

  try {
    // Find the token in the sessions collection
    const session = await Token.findOne({ token });
    if (!session) {
      return res.status(401).send("Invalid token");
    }

    // Attach user data to request object
    req.user = { id: session.userId, fullName: session.fullName };
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(500).send("Server error");
  }
};

router.post("/register", registerUser);
router.get("/verify/:uniqueString", verifyEmail);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user_verif = await user.findOne({ email });

    // Check if user exists
    if (!user_verif) {
      return res.status(400).send("Email or password invalid");
    }

    // Check if the user's email is verified
    if (!user_verif.verified) {
      return res.status(400).send("Please verify your email before logging in");
    }

    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, user_verif.password);
    if (!isPasswordValid) {
      return res.status(400).send("Email or password invalid");
    }

    // Create a JWT payload
    const payload = {
      _id: user_verif._id,
      email: user_verif.email,
      fullName: `${user_verif.firstname} ${user_verif.lastname}`,
    };

    const jwtSecret = process.env.JWT_SECRET || "defaultSecret";
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: process.env.JWT_EXPIRATION || "2h",
    });

    // Store the token in the database
    await Token.create({
      token,
      userId: user_verif._id,
      fullName: payload.fullName,
    });

    // Send the token in the response
    res.status(200).send({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send("Login failed");
  }
});

router.get("/profile", verifyToken, async (req, res) => {
  try {
    res.status(200).send(req.user.fullName); // Send back full name
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch user profile");
  }
});

router.get("/all", async (req, res) => {
  try {
    const users = await user.find();
    res.status(200).send(users);
  } catch (err) {
    console.log(err);
    res.status(500).send("Failed to fetch users");
  }
});

router.get("/getbyid/:id", async (req, res) => {
  try {
    const User = await user.findById(req.params.id);
    if (!User) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(User);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch user by ID");
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const updatedUser = await user.findByIdAndUpdate({ _id: id }, data, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).send("User not found");
    } else {
      res.status(200).send(updatedUser);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let data = await user.findOneAndDelete({ _id: id });
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
