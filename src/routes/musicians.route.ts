import { Router } from "express";
import { MusicianController } from "../controllers/musicians.controller.js";
import { tryCatch } from "../utils/try-catch.js";
import { uploadFile } from "../middlewares/image-upload.middleware.js";

export const musicianRouter = Router();

musicianRouter.get("/", tryCatch(MusicianController.getAll));
musicianRouter.get("/:id", tryCatch(MusicianController.getById));
musicianRouter.patch(
  "/",
  uploadFile.single("image"),
  tryCatch(MusicianController.createUpdateProfile)
);
musicianRouter.get("/more-info/:id", tryCatch(MusicianController.getMoreInfo));
