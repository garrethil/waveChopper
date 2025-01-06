import { Application } from "express";
import authRoutes from "./auth";
// import projectRoutes from "./project";

export const registerRoutes = (app: Application) => {
  app.use("/auth", authRoutes);
  //   app.use("/projects", projectRoutes);
};
