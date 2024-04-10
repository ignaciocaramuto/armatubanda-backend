import { Router } from "express";
import { GenreController } from "../controllers/genres.controller.js";
import { tryCatch } from "../utils/try-catch.js";
import { adminValidation } from "../middlewares/admin.middleware.js";

export const genreRouter = Router();

genreRouter.get("/", tryCatch(GenreController.getAll));
genreRouter.post("/", adminValidation, tryCatch(GenreController.create)); // TODO: Only admin
