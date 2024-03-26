import { Router } from "express";
import { tryCatch } from "../utils/try-catch.js";
import { CommentController } from "../controllers/comment.controller.js";

export const commentRouter = Router();

commentRouter.get("/:id", tryCatch(CommentController.getAll));
commentRouter.post("/:id", tryCatch(CommentController.create));
