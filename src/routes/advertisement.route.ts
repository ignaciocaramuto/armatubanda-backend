import { Router } from "express";
import { tryCatch } from "../utils/try-catch.js";
import { AdvertisementController } from "../controllers/advertisements.controller.js";

export const advertisementRouter = Router();

advertisementRouter.get(
  "/:id",
  tryCatch(AdvertisementController.getAllFromBand)
);
advertisementRouter.post("/:id", tryCatch(AdvertisementController.create));
advertisementRouter.delete(
  "/:bandId/:id",
  tryCatch(AdvertisementController.delete)
);
