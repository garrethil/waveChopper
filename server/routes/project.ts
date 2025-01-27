import express from "express";
import multer from "multer";
import AWS from "aws-sdk";
import { authenticateToken } from "../middleware/authenticateToken";
import {
  decodeAudio,
  reverseAudio,
  jumbleAudio,
  encodeAudio,
} from "../utils/audioUtils";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// AWS S3 configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
  signatureVersion: "v4",
});

router.post(
  "/upload",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    const user = req.user;
    const file = req.file;
    const projectName = req.body.projectName;
    const manipulationType = req.body.manipulationType; // Specify the type of manipulation: "reverse" or "jumble"

    if (!user?.id || !file || !projectName || !manipulationType) {
      return res
        .status(400)
        .json({ error: "User ID, file, and project name are required." });
    }

    try {
      // Decode the uploaded audio file
      const decodedAudio = await decodeAudio(file.buffer);

      // Manipulate the audio data
      const int16ChannelData = new Int16Array(decodedAudio.channelData.buffer);
      let manipulatedAudio: any;
      if (manipulationType === "reverse") {
        manipulatedAudio = reverseAudio([int16ChannelData]);
      } else if (manipulationType === "jumble") {
        manipulatedAudio = jumbleAudio(
          [int16ChannelData],
          decodedAudio.sampleRate
        );
      }

      // Encode the manipulated audio back to a Buffer
      const encodedAudioBuffer = await encodeAudio(
        manipulatedAudio,
        decodedAudio.sampleRate
      );

      // Upload original file
      const originalFileKey = `${user.id}/${projectName}/${Date.now()}-${
        file.originalname
      }`;
      await s3
        .upload({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: originalFileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
        .promise();

      // Upload manipulated file
      const manipulatedFileKey = `${
        user.id
      }/${projectName}/manipulated-${Date.now()}-${file.originalname}`;
      await s3
        .upload({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: manipulatedFileKey,
          Body: encodedAudioBuffer,
          ContentType: "audio/wav",
        })
        .promise();

      return res.status(200).json({
        message: "Files uploaded successfully.",
        data: {
          originalFileUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${originalFileKey}`,
          manipulatedFileUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${manipulatedFileKey}`,
        },
      });
    } catch (error) {
      console.error("Error processing and uploading files:", error);
      return res.status(500).json({
        error:
          error instanceof Error ? error.message : "Internal server error.",
      });
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
      Prefix: `${user.id}/`, // User-specific folder
    };

    const data = await s3.listObjectsV2(params).promise();

    if (!data.Contents || data.Contents.length === 0) {
      return res.status(200).json({ success: true, projects: [] });
    }

    // Group files by project name
    const groupedProjects: Record<
      string,
      { originalFile?: any; manipulatedFile?: any }
    > = {};

    for (const file of data.Contents) {
      const parts = file.Key!.split("/");
      const projectName = parts[1]; // Assuming structure: userID/projectName/fileName

      if (!groupedProjects[projectName]) {
        groupedProjects[projectName] = {};
      }

      // Generate a signed URL for each file
      const signedUrl = s3.getSignedUrl("getObject", {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: file.Key!,
        Expires: 3600, // URL valid for 1 hour
      });

      if (file.Key!.includes("manipulated")) {
        groupedProjects[projectName].manipulatedFile = {
          key: file.Key,
          url: signedUrl,
        };
      } else {
        groupedProjects[projectName].originalFile = {
          key: file.Key,
          url: signedUrl,
        };
      }
    }

    const projects = Object.entries(groupedProjects).map(([name, files]) => ({
      name,
      ...files,
    }));

    return res.status(200).json({ success: true, projects });
  } catch (error) {
    console.error("Error fetching files from S3:", error);
    res.status(500).json({ error: "Failed to fetch files." });
  }
});

// Delete project route
router.delete("/delete-project", authenticateToken, async (req, res) => {
  const user = req.user;
  const projectName = req.body.projectName;

  console.log("Delete project request received");
  console.log("User ID:", user?.id);
  console.log("Project Name:", projectName);

  if (!user?.id || !projectName) {
    console.log("Missing user ID or project name");
    return res
      .status(400)
      .json({ error: "User ID and project name are required." });
  }

  try {
    // List all files in the project folder
    const listParams: AWS.S3.ListObjectsV2Request = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Prefix: `${user.id}/${projectName}/`,
    };

    console.log("Listing objects with params:", listParams);

    const listData = await s3.listObjectsV2(listParams).promise();

    console.log("List data received:", listData);

    if (!listData.Contents || listData.Contents.length === 0) {
      return res.status(404).json({ error: "Project not found." });
    }

    // Create delete parameters
    const deleteParams: AWS.S3.DeleteObjectsRequest = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Delete: {
        Objects: listData.Contents.map((item) => ({ Key: item.Key! })),
      },
    };
    // Delete the files
    const deleteData = await s3.deleteObjects(deleteParams).promise();

    console.log("Delete data received:", deleteData);

    return res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error.",
    });
  }
});

export default router;
