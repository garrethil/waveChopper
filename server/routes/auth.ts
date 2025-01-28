import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const router = express.Router();

interface AuthRequestBody {
  email: string;
  password: string;
}

// Register route
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body as AuthRequestBody;

    const isEmailAlreadyExist = await User.findOne({ email });

    if (isEmailAlreadyExist) {
      return res.status(400).json({
        status: 400,
        message: "Email already in use",
      });
    }

    const newUser = await User.create({ email, password });

    res.status(201).json({
      status: 201,
      success: true,
      message: "User created successfully",
      user: { id: newUser._id, email: newUser.email },
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body as AuthRequestBody;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found",
      });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Wrong password",
      });
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      status: 200,
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
});

export default router;
