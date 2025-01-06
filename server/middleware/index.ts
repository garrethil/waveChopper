import cors from "cors";
import express, { Application } from "express";

export const registerMiddleware = (app: Application) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};
