import express from "express";
import multer from "multer";
import AWS from "aws-sdk";
import { authenticateToken } from "../middleware/authenticateToken";
import { Project } from "../models/Project"; // Example MongoDB model

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// AWS S3 configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
});

// Upload post route
router.post(
  "/upload",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    const user = req.user; // Extracted authenticateToken middleware
    const file = req.file;
    const { projectName } = req.body; // Expecting projectName from the request body

    if (!user?.id || !file || !projectName) {
      return res
        .status(400)
        .json({ error: "User ID, project name, and file are required." });
    }

    try {
      // Upload file to S3 under user's folder and project folder
      const uploadParams: AWS.S3.PutObjectRequest = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: `${user.id}/${projectName}/${file.originalname}`, // Organized by userId/projectName
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const result = await s3.upload(uploadParams).promise();

      return res.status(200).json({
        message: "File uploaded successfully.",
        data: {
          s3Url: result.Location,
          project: projectName,
          fileName: file.originalname,
        },
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
);

router.get("/user-files", authenticateToken, async (req, res) => {
  const user = req.user;

  if (!user?.id) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    const params: AWS.S3.ListObjectsV2Request = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Prefix: `${user.id}/`, // Ensure this matches the upload folder structure
    };

    const data = await s3.listObjectsV2(params).promise();

    if (!data.Contents || data.Contents.length === 0) {
      return res
        .status(404)
        .json({ message: "No files found in your folder." });
    }

    const files = data.Contents.map((file) => ({
      key: file.Key,
      lastModified: file.LastModified,
      size: file.Size,
      url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`,
    }));

    res.status(200).json({ success: true, files });
  } catch (error) {
    console.error("Error fetching files from S3:", error);
    res.status(500).json({ error: "Failed to fetch files." });
  }
});

export default router;
