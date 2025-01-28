import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User"; // Assuming you have a User model defined

const router = express.Router();

interface AuthRequestBody {
  email: string;
  password: string;
}

// Register route
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body as AuthRequestBody;

    // Regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid email format",
      });
    }

    // Regex for password validation (at least 8 characters, one letter, one number)
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        status: 400,
        message:
          "Password must be at least 8 characters long and contain at least one letter and one number",
      });
    }

    const isEmailAlreadyExist = await User.findOne({ email });

    if (isEmailAlreadyExist) {
      return res.status(400).json({
        status: 400,
        message: "Email already in use",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.status(201).json({
      status: 201,
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
    });
  }
});

export default router;
