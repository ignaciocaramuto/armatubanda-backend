import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Instrument } from "../models/instrument.entity.js";

const em = orm.em;

export class InstrumentController {
  static async getAll(req: Request, res: Response) {
    const { name } = req.params;
    const instruments = await em.find(Instrument, { name });
    res.status(200).json(instruments);
  }

  static async create(req: Request, res: Response) {
    const instrument = em.create(Instrument, req.body);
    await em.flush();
    res.status(201).json(instrument);
  }
}
