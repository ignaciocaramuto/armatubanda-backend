import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Band } from "../models/band.entity.js";
import { Advertisement } from "../models/advertisement.entity.js";
import { AppError } from "../utils/app-error.js";
import { Application } from "../models/application.entity.js";
import { Status } from "../enums/status.enum.js";

const em = orm.em;

export class ApplicationController {
  static async create(req: Request, res: Response) {
    const { id } = req.user;
    const adId = Number.parseInt(req.params.id);

    const ad = await em.findOne(Application, {
      advertisement: adId,
      applicant: id,
    });

    if (ad) {
      throw new AppError(
        `Ya realizaste una solicitud a este aviso. Estado de la solicitud: ${ad.status}`,
        409
      );
    }

    const { band } = await em.findOneOrFail(
      Advertisement,
      { id: adId },
      { populate: ["band.id"] }
    );

    const bandOfMusician = await em.findOne(Band, { id: band.id });
    const isLeader = await em.findOne(Band, { id: band.id, leader: id });

    let isMember = false;

    if (bandOfMusician?.members.isInitialized()) {
      isMember = bandOfMusician.members.getItems().some(({ id }) => id === id);
    }

    if (isMember || isLeader) {
      throw new AppError("El músico ya pertenece a la banda", 409);
    }

    const application = await em.create(Application, {
      ...req.body,
      status: Status.PENDING,
      advertisement: adId,
      applicant: id,
    });

    await em.flush();
    res.status(201).json(application);
  }

  static async accept(req: Request, res: Response) {
    const { id } = req.user;
    const applicationId = Number.parseInt(req.params.id);
    const bandId = Number.parseInt(req.params.bandId);

    const band = await em.findOneOrFail(Band, { id: bandId, leader: id });

    const application = await em.findOneOrFail(Application, {
      id: applicationId,
    });

    const { members } = band;

    if (!members.isInitialized()) {
      await members.init();
    }

    members.add(application.applicant);

    await em.assign(application, { status: Status.ACCEPTED });
    await em.assign(band, { members });
    await em.flush();
    res.status(200).json({ message: "Solicitud aceptada correctamente." });
  }

  static async reject(req: Request, res: Response) {
    const { id } = req.user;
    const applicationId = Number.parseInt(req.params.id);
    const bandId = Number.parseInt(req.params.bandId);

    await em.findOneOrFail(Band, { id: bandId, leader: id });

    const application = await em.findOneOrFail(Application, {
      id: applicationId,
    });

    await em.assign(application, { status: Status.REJECTED });
    await em.flush();
    res.status(200).json({ message: "Solicitud rechazada correctamente." });
  }

  static async getAllFromBand(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);

    const applications = await em.find(Application, {
      advertisement: id,
    });
    res.status(200).json(applications);
  }
}
