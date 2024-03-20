import { Router } from "express";
import { InstrumentController } from "../controllers/instruments.controller.js";

export const instrumentRouter = Router();

instrumentRouter.get("/", InstrumentController.getAll);
instrumentRouter.post("/", InstrumentController.create);
