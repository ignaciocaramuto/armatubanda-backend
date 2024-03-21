import { Router } from "express";
import { GenreController } from "../controllers/genres.controller.js";
import { tryCatch } from "../utils/try-catch.js";

export const genreRouter = Router();

genreRouter.get("/", tryCatch(GenreController.getAll));
genreRouter.post("/", tryCatch(GenreController.create));
