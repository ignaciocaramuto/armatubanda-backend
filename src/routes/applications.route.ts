import { Router } from "express";
import { tryCatch } from "../utils/try-catch.js";
import { ApplicationController } from "../controllers/applications.controller.js";

export const applicationRouter = Router();

applicationRouter.post("/:id", tryCatch(ApplicationController.create));
applicationRouter.patch(
  "/accept/:bandId/:id",
  tryCatch(ApplicationController.accept)
);
applicationRouter.patch(
  "/reject/:bandId/:id",
  tryCatch(ApplicationController.reject)
);
applicationRouter.get("/", tryCatch(ApplicationController.getAllFromBand));
