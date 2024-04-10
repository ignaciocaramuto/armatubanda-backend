import { Router } from "express";
import { tryCatch } from "../utils/try-catch.js";
import { AdvertisementController } from "../controllers/advertisements.controller.js";

export const advertisementRouter = Router();

advertisementRouter.get("/", tryCatch(AdvertisementController.getAll));
advertisementRouter.get(
  "/:id",
  tryCatch(AdvertisementController.getAllFromBand)
);
advertisementRouter.post("/:id", tryCatch(AdvertisementController.create));
advertisementRouter.delete("/:id", tryCatch(AdvertisementController.delete));
advertisementRouter.get(
  "/:bandId/:id",
  tryCatch(AdvertisementController.getApplications)
);
