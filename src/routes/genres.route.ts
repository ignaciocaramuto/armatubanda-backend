import { Router } from "express";
import { GenreController } from "../controllers/genres.controller.js";

export const genreRouter = Router();

genreRouter.get("/", GenreController.getAll);
genreRouter.post("/", GenreController.create);
