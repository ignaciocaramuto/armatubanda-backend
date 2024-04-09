import { Router } from "express";
import { tryCatch } from "../utils/try-catch.js";
import { InvitationController } from "../controllers/invitations.controller.js";

export const invitationRouter = Router();

invitationRouter.get("/", tryCatch(InvitationController.getAllFromMusician));
invitationRouter.post(
  "/:bandId/:musicianId",
  tryCatch(InvitationController.create)
);
invitationRouter.delete("/:id", tryCatch(InvitationController.update));
