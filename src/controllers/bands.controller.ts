import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Band } from "../models/band.entity.js";

const em = orm.em;

export class BandController {
  static async getAll(req: Request, res: Response) {
    const bands = await em.find(Band, {});
    res.status(200).json(bands);
  }

  static async getById(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);
    const band = await em.findOneOrFail(Band, { id });

    res.status(200).json(band);
  }

  static async create(req: Request, res: Response) {
    const emFork = em.fork();
    const { id } = req.user;

    const band = emFork.create(Band, {
      ...req.body,
      leader: id,
      imagePath: req.file?.path,
    });
    await emFork.flush();
    res.status(201).json(band);
  }

  static async edit(req: Request, res: Response) {
    const emFork = em.fork();
    const { id } = req.user;
    const bandId = Number.parseInt(req.params.id);

    const band = await emFork.findOneOrFail(Band, { id: bandId, leader: id });

    await emFork.assign(band, { ...req.body, imagePath: req.file?.path });
    await emFork.flush();
    res.status(201).json(band);
  }
}
