import { Router } from "express";
import { tryCatch } from "../utils/try-catch.js";
import { uploadFile } from "../middlewares/image-upload.middleware.js";
import { BandController } from "../controllers/bands.controller.js";

export const bandRouter = Router();

bandRouter.get("/", tryCatch(BandController.getAll));
bandRouter.get("/:id", tryCatch(BandController.getById));
bandRouter.post(
  "/",
  uploadFile.single("image"),
  tryCatch(BandController.create)
);
