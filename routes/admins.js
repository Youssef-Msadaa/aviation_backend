const express = require("express");
const admin = require("../models/admins");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Token = require("../models/token");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("Unauthorized");

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).send("Unauthorized");

  try {
    const session = await Token.findOne({ token });
    if (!session) {
      return res.status(401).send("Invalid token");
    }
    req.admin = { id: session.adminId, role: session.role };
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(500).send("Server error");
  }
};

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const newAdmin = new admin({
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    newAdmin.password = hashedPassword;
    await newAdmin.save();

    res.status(201).json(newAdmin);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred during registration", error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const data = req.body;
    const adminVerif = await admin.findOne({ email: data.email });

    if (
      !adminVerif ||
      !bcrypt.compareSync(data.password, adminVerif.password)
    ) {
      return res.status(400).send("Email or password invalid");
    }

    const payload = {
      _id: adminVerif._id,
      email: adminVerif.email,
    };

    const jwtSecret = process.env.JWT_SECRET || "defaultSecret";
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
    await Token.create({
      token,
      userId: adminVerif._id,
    });
    res.status(200).send({ token: token });
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message || "Login failed");
  }
});

module.exports = router;
