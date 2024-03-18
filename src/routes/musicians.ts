import { Router } from "express";
import { MusicianController } from "../controllers/musicians.js";

export const musicianRouter = Router();

musicianRouter.get("/", MusicianController.getAll);
musicianRouter.get("/:id", MusicianController.getById);
musicianRouter.post("/", MusicianController.create);
musicianRouter.patch("/:id", MusicianController.update);
