import dotenv from "dotenv";
import express, { Request, Response } from "express";
import path from "path";
import routes from "./routes";
import db from "./config/connection";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

//middlewear to parse json and urlencoded data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to WaveChopper");
});

//serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
    console.log(
      "Connected to MongoDB at:",
      process.env.MONGODB_URI || "mongodb://localhost:27017/wavchopper"
    );
  });
});
