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
    const band = em.create(Band, req.body);
    await em.flush();
    res.status(201).json(band);
  }
}
