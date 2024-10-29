"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const connection_1 = __importDefault(require("./config/connection"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
//middlewear to parse json and urlencoded data
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Welcome to WaveChopper");
});
//serve static files in production
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static(path_1.default.join(__dirname, "../client/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.join(__dirname, "../client/dist/index.html"));
    });
}
connection_1.default.once("open", () => {
    app.listen(PORT, () => {
        console.log(`Server is listening on http://localhost:${PORT}`);
        console.log("Connected to MongoDB at:", process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase");
    });
});
