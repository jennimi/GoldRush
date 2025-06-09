// backend-api/controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    console.log("📩 Body:", req.body);
    console.log("📷 File:", req.file);

    const { username, password } = req.body;
    const ktpPath = req.file?.path;

    if (!username || !password || !ktpPath) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ msg: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      hashedPassword,
      ktpPath,
    });

    await newUser.save();
    res.status(201).json({ msg: "Registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.json({ token, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

