import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { tryCatch } from "../utils/try-catch.js";
import { validation } from "../middlewares/validation.middleware.js";
import { registerLoginSchema } from "../validations/register-login.validation.js";
import { verifyToken } from "../middlewares/verify-token.middleware.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  validation(registerLoginSchema),
  tryCatch(AuthController.register)
);
authRouter.post(
  "/login",
  validation(registerLoginSchema),
  tryCatch(AuthController.login)
);
authRouter.get("/me", verifyToken, tryCatch(AuthController.getCurrentMusician));
