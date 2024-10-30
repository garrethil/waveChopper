import mongoose, { Schema, Document, Types } from "mongoose";

// Define TypeScript interface
interface ICreation extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  title: string;
  origFileUrl: string;
  manipFileUrl: string;
  fileSize: number;
  duration: number;
}

// Use interface in Schema
const creationSchema = new Schema<ICreation>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  origFileUrl: {
    type: String,
    required: true,
    unique: true,
  },
  manipFileUrl: {
    type: String,
    required: true,
    unique: true,
  },
  fileSize: {
    type: Number,
    required: true,
    unique: true,
  },
  duration: {
    type: Number,
    required: true,
    unique: true,
  },
});

const Creation = mongoose.model<ICreation>("Creation", creationSchema);

export default Creation;
