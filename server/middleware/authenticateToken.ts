import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  _id: string;
  email: string;
}

// Middleware to authenticate the token
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token

  if (!token) {
    return res.status(401).json({ error: "Access token is missing or invalid." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // Attach user ID and email to request body
    req.body.userId = decoded._id;
    req.body.email = decoded.email;

    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};
