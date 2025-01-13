import dotenv from "dotenv";

dotenv.config();

export const PORT = parseInt(process.env.PORT || "8000", 10);
export const MONGO_URI = process.env.MONGO_URI || "";
export const JWT_SECRET = process.env.JWT_SECRET || "";
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "";
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "";
export const AWS_REGION = process.env.AWS_REGION || "";
