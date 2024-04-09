import { Router } from "express";
import { tryCatch } from "../utils/try-catch.js";
import { CommentController } from "../controllers/comment.controller.js";

export const commentRouter = Router();

commentRouter.get(
  "/musician/:id",
  tryCatch(CommentController.getAllFromMusician)
);
commentRouter.get("/band/:id", tryCatch(CommentController.getAllFromBand));
commentRouter.post(
  "/musician/:id",
  tryCatch(CommentController.createForMusician)
);
commentRouter.post("/band/:id", tryCatch(CommentController.createForBand));
