import cors from "cors";
import express, { Application } from "express";

// Allow requests only from your deployed frontend
const allowedOrigins = ["http://18.224.38.14:8000/"];

export const registerMiddleware = (app: Application) => {
  app.use(
    cors({
      origin: allowedOrigins,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      preflightContinue: false,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};
