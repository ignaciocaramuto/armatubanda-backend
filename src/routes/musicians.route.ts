import { Router } from "express";
import { MusicianController } from "../controllers/musicians.controller.js";
import { tryCatch } from "../utils/try-catch.js";
import { uploadFile } from "../middlewares/image-upload.middleware.js";

export const musicianRouter = Router();

musicianRouter.get("/", tryCatch(MusicianController.getAll));
musicianRouter.get("/:id", tryCatch(MusicianController.getById));
musicianRouter.put(
  "/",
  uploadFile.single("image"),
  tryCatch(MusicianController.createUpdateProfile)
);
musicianRouter.get("/more-info/:id", tryCatch(MusicianController.getMoreInfo));
musicianRouter.get(
  "/:id/bands",
  tryCatch(MusicianController.getBandsFromMusician)
);
musicianRouter.get(
  "/leader/:id",
  tryCatch(MusicianController.getBandsFromLeaderToInviteMusician)
);
