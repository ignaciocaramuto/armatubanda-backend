import { Router } from "express";
import { PostController } from "../controllers/posts.controller.js";
import { tryCatch } from "../utils/try-catch.js";
import { validation } from "../middlewares/validation.middleware.js";
import { postSchema } from "../validations/post.validation.js";

export const postRouter = Router();

postRouter.get("/:id", tryCatch(PostController.getAll));
postRouter.post(
  "/musician",
  validation(postSchema),
  tryCatch(PostController.createForMusician)
);
postRouter.post(
  "/band/:id",
  validation(postSchema),
  tryCatch(PostController.createForBand)
);
postRouter.delete("/musician/:id", tryCatch(PostController.deleteForMusician));
postRouter.delete("/band/:bandId/:id", tryCatch(PostController.deleteForBand));
