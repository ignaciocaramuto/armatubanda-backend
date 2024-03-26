import { Router } from "express";
import { PostController } from "../controllers/posts.controller.js";
import { tryCatch } from "../utils/try-catch.js";
import { validation } from "../middlewares/validation.middleware.js";
import { postSchema } from "../validations/post.validation.js";

export const postRouter = Router();

postRouter.get("/:id", tryCatch(PostController.getAll));
postRouter.post("/", validation(postSchema), tryCatch(PostController.create));
postRouter.delete("/:id", tryCatch(PostController.delete));
