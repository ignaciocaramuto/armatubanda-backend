import { Router } from "express";
import { MusicianController } from "../controllers/musicians.controller.js";
import { tryCatch } from "../utils/try-catch.js";

export const musicianRouter = Router();

musicianRouter.get("/", tryCatch(MusicianController.getAll));
musicianRouter.get("/:id", tryCatch(MusicianController.getById));
musicianRouter.post("/", tryCatch(MusicianController.create));
musicianRouter.patch("/:id", tryCatch(MusicianController.createProfile));
