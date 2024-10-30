import jwt from "jsonwebtoken";
import User from "../models/User";
import { Request, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "super_salt";

// generate a JWT

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
};

// verify user credentials
export const loginUser = async (
  email: string,
  password: string
): Promise<string | null> => {
  const user = await User.findOne({ email });
  if (!user) return null;

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return null;

  return generateToken(user._id.toString());
};
