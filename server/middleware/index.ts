import cors from "cors";
import express, { Application } from "express";

// Allow requests only from your deployed frontend
const allowedOrigins = [
  "https://wave-chopper-2dc5d4458dd7.herokuapp.com", // Frontend URL
  "https://wave-chopper.herokuapp.com", // Backend URL
];

export const registerMiddleware = (app: Application) => {
  app.use(
    cors({
      origin: allowedOrigins,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      preflightContinue: false, // Pass the CORS preflight response to the next handler
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};
