import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectionString: string =
  process.env.MONGODB_URI || "mongodb://localhost:27017/wavchopper";

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB Connection Error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

export default db;
