// routes/index.ts

import { Router } from "express";
import authRoutes from "./authRoutes";
// import creationRoutes from "./creationRoutes";

const router = Router();

// Attach individual routers to main router
router.use("/auth", authRoutes); // All auth-related routes will be prefixed with /auth
// router.use("/creations", creationRoutes); // All creation-related routes will be prefixed with /creations

export default router;
