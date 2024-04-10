import { Router } from "express";
import { InstrumentController } from "../controllers/instruments.controller.js";
import { tryCatch } from "../utils/try-catch.js";
import { adminValidation } from "../middlewares/admin.middleware.js";

export const instrumentRouter = Router();

instrumentRouter.get("/", tryCatch(InstrumentController.getAll));
instrumentRouter.post(
  "/",
  adminValidation,
  tryCatch(InstrumentController.create)
); // TODO: Only admin
instrumentRouter.put("/:name", tryCatch(InstrumentController.update));
instrumentRouter.delete("/:name", tryCatch(InstrumentController.delete));
