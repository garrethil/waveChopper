import { Router, Request, Response } from "express";
import multer from "multer";
import AWS from "aws-sdk";
import { User } from "../models/User";

const router = Router();
const upload = multer();

// AWS S3 configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
});

// Interface for the request body
interface UploadRequest extends Request {
  file?: Express.Multer.File; // Make file optional
  body: {
    userId: string;
  };
}

// File upload route
router.post(
  "/upload",
  upload.single("file"),
  async (req: UploadRequest, res: Response) => {
    const { userId } = req.body;
    const file = req.file;

    if (!userId || !file) {
      return res.status(400).json({ error: "User ID and file are required." });
    }

    try {
      // Verify the user exists in the database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      // Upload file to S3 under user's folder
      const uploadParams: AWS.S3.PutObjectRequest = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `${userId}/${file.originalname}`, // Path: userID/filename
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const result = await s3.upload(uploadParams).promise();
      return res
        .status(200)
        .json({ message: "File uploaded successfully.", data: result });
    } catch (error) {
      console.error("Error uploading file:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
);

export default router;
