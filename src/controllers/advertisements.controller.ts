import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Band } from "../models/band.entity.js";
import { Advertisement } from "../models/advertisement.entity.js";

const em = orm.em;

export class AdvertisementController {
  static async getAllFromBand(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);

    const advertisements = await em.find(Advertisement, { band: id });
    res.status(200).json(advertisements);
  }

  static async create(req: Request, res: Response) {
    const { id } = req.user;
    const bandId = Number.parseInt(req.params.id);

    await em.findOneOrFail(Band, { id: bandId, leader: id });

    const advertisement = await em.create(Advertisement, {
      ...req.body,
      band: bandId,
    });

    await em.flush();
    res.status(201).json(advertisement);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.user;
    const bandId = Number.parseInt(req.params.bandId);
    const adId = Number.parseInt(req.params.id);

    await em.findOneOrFail(Band, { id: bandId, leader: id });

    const advertisement = await em.findOneOrFail(Advertisement, { id: adId });
    await em.removeAndFlush(advertisement);
    res.status(200).json({ message: "Aviso eliminado correctamente" });
  }
}
