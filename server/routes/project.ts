import express from "express";
import multer from "multer";
import AWS from "aws-sdk";
import { authenticateToken } from "../middleware/authenticateToken";

const router = express.Router();
const upload = multer();

// AWS S3 configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
});

// Protected upload route
router.post(
  "/upload",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    const { userId } = req.body; // Extracted authenticateToken middleware
    const file = req.file;

    if (!userId || !file) {
      return res.status(400).json({ error: "User ID and file are required." });
    }

    try {
      // Upload file to S3 under user's folder
      const uploadParams: AWS.S3.PutObjectRequest = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `${userId}/${file.originalname}`,
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
