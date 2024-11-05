import express from "express";
import User from "../models/User";
import { loginUser } from "../auth/authHelper";

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const newUser = new User({ email, passwordHash: password });
    await newUser.save();
    return res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Error registering user." });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);
    if (!token) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in." });
  }
});

export default router;
