import express, { Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { registerMiddleware } from "./middleware";
import { registerRoutes } from "./routes";

dotenv.config();

const mongoUri = process.env.MONGO_URI;

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || "8000", 10);

// Middleware
registerMiddleware(app);

// API Routes
registerRoutes(app);

const frontendPath = path.join(__dirname, "../../client/dist");

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Connect to MongoDB and Start Server
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  try {
    await mongoose.connect(mongoUri as string);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
});
