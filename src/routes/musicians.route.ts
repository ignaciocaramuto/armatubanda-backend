import { Router } from "express";
import { MusicianController } from "../controllers/musicians.controller.js";
import { tryCatch } from "../utils/try-catch.js";
import { uploadFile } from "../middlewares/image-upload.middleware.js";

export const musicianRouter = Router();

musicianRouter.get("/", tryCatch(MusicianController.getAll));
musicianRouter.get("/:id", tryCatch(MusicianController.getById));
musicianRouter.post("/", tryCatch(MusicianController.create));
musicianRouter.patch(
  "/",
  uploadFile.single("image"),
  tryCatch(MusicianController.createUpdateProfile)
);
