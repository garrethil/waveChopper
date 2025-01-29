import express from "express";
import multer from "multer";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { authenticateToken } from "../middleware/authenticateToken";
import {
  decodeAudio,
  reverseAudio,
  jumbleAudio,
  encodeAudio,
} from "../utils/audioUtils";
import { fromEnv } from "@aws-sdk/credential-providers"; // Correctly resolves credentials

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// AWS S3 configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: fromEnv(),
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
      return res.status(400).json({
        error:
          "User ID, file, project name, and manipulation type are required.",
      });
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
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: originalFileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      // Upload manipulated file with manipulation type in the key
      const manipulatedFileKey = `${
        user.id
      }/${projectName}/manipulated-${manipulationType}-${Date.now()}-${
        file.originalname
      }`;
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: manipulatedFileKey,
          Body: encodedAudioBuffer,
          ContentType: "audio/wav",
        })
      );

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
    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Prefix: `${user.id}/`, // User-specific folder
    };

    const data = await s3Client.send(new ListObjectsV2Command(params));

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

      const signedUrl = await getSignedUrl(
        s3Client,
        new GetObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: file.Key!,
        }),
        { expiresIn: 3600 }
      );
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

  if (!user?.id || !projectName) {
    return res
      .status(400)
      .json({ error: "User ID and project name are required." });
  }

  try {
    // List all files in the project folder
    const listParams = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Prefix: `${user.id}/${projectName}/`,
    };

    const listData = await s3Client.send(new ListObjectsV2Command(listParams));

    if (!listData.Contents || listData.Contents.length === 0) {
      return res.status(404).json({ error: "Project not found." });
    }

    // Create delete parameters
    const deleteParams = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Delete: {
        Objects: listData.Contents.map((item) => ({ Key: item.Key! })),
      },
    };

    // Delete the files
    await s3Client.send(new DeleteObjectsCommand(deleteParams));

    return res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error.",
    });
  }
});

export default router;
