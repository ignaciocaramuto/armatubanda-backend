import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Musician } from "../models/musician.entity.js";

const em = orm.em;
export class MusicianController {
  static async getAll(req: Request, res: Response) {
    const musicians = await em.find(Musician, {});
    res.status(200).json(musicians);
  }

  static async getById(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);
    const musician = await em.findOneOrFail(Musician, { id });

    res.status(200).json(musician);
  }

  static async createUpdateProfile(req: Request, res: Response) {
    const emFork = em.fork();
    const { id } = req.user;
    const musician = emFork.getReference(Musician, id);

    emFork.assign(musician, {
      ...req.body,
      isProfileSet: true,
      imagePath: req.file?.path,
    });
    await emFork.flush();
    res.status(200).json(musician);
  }
}
