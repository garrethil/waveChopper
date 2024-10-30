import mongoose, { Schema, Document, Types } from "mongoose";

// Define TypeScript interface
interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  creations: Types.ObjectId[];
}

// Use interface in Schema
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  creations: [
    {
      type: Schema.Types.ObjectId,
      ref: "Creation", // to be updated when creation model is made
    },
  ],
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
