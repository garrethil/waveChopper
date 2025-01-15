import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  userId: string;
  name: string;
  files: {
    fileName: string;
    s3Url: string;
    uploadDate: Date;
  }[];
  updatedAt: Date;
}

const ProjectSchema = new Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    files: [
      {
        fileName: { type: String, required: true },
        s3Url: { type: String, required: true },
        uploadDate: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>("Project", ProjectSchema);
