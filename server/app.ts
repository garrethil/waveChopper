import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "./models/User";
import { registerMiddleware } from "./middleware";

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || "8000", 10);

// Middleware
registerMiddleware(app);

// Connect to MongoDB and Start Server
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
});
