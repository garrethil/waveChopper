import mongoose, { Schema, Document, Types } from "mongoose";
import bcrypt from "bcrypt";

// Define TypeScript interface
interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  creations: Types.ObjectId[];
  comparePassword(password: string): Promise<boolean>;
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

// Add the comparePassword method to the schema
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.passwordHash);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
