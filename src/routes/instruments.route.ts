import { Router } from "express";
import { InstrumentController } from "../controllers/instruments.controller.js";
import { tryCatch } from "../utils/try-catch.js";

export const instrumentRouter = Router();

instrumentRouter.get("/", tryCatch(InstrumentController.getAll));
instrumentRouter.post("/", tryCatch(InstrumentController.create));
