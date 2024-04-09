import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Band } from "../models/band.entity.js";
import { Invitation } from "../models/invitation.entity.js";
import { Status } from "../enums/status.enum.js";
import { AppError } from "../utils/app-error.js";

const em = orm.em;

export class InvitationController {
  static async getAllFromMusician(req: Request, res: Response) {
    const { id } = req.user;

    const invitations = await em.find(
      Invitation,
      { musician: id },
      { populate: ["band"] }
    );
    res.status(200).json(invitations);
  }

  static async create(req: Request, res: Response) {
    const { id } = req.user;
    const bandId = Number.parseInt(req.body.bandId);
    const musicianId = Number.parseInt(req.body.musicianId);

    const { name } = await em.findOneOrFail(Band, { id: bandId, leader: id });
    const invited = await em.findOne(Invitation, {
      band: bandId,
      musician: musicianId,
    });

    if (invited) {
      throw new AppError(`Ya has invitado a este músico.`, 409);
    }

    const member = await em.findOne(Band, { members: musicianId });
    const leader = await em.findOne(Band, { leader: musicianId });

    if (member || leader) {
      throw new AppError(
        `El músico con id ${musicianId} ya es miembro de ${name}.`,
        409
      );
    }

    await em.create(Invitation, {
      status: Status.PENDING,
      band: bandId,
      musician: musicianId,
    });

    await em.flush();
    res.status(201).json({ message: "Invitación enviada correctamente" });
  }

  static async update(req: Request, res: Response) {
    const { id } = req.user;
    const invitationId = Number.parseInt(req.params.id);
    const accepted = Boolean(req.query.accepted);

    const invitation = await em.findOneOrFail(Invitation, {
      id: invitationId,
      musician: id,
    });

    if (accepted) {
      const band = await em.findOneOrFail(Band, { id: invitation.band.id });
      const { members } = band;

      if (!members.isInitialized()) {
        await members.init();
      }

      members.add(invitation.musician);
      await em.assign(band, { members });
    }

    em.remove(invitation);
    await em.flush();
    res.status(200).json({
      message: `Invitación ${
        accepted ? "aceptada" : "rechazada"
      } correctamente`,
    });
  }
}
