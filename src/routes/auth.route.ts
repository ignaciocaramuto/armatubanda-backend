import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { tryCatch } from "../utils/try-catch.js";

export const authRouter = Router();

authRouter.post("/register", tryCatch(AuthController.register));
authRouter.post("/login", tryCatch(AuthController.login));
