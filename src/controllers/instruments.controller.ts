import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Instrument } from "../models/instrument.entity.js";

const em = orm.em;

export class InstrumentController {
  static async getAll(req: Request, res: Response) {
    const instruments = await em.findAll(Instrument);
    res.status(200).json(instruments);
  }

  static async create(req: Request, res: Response) {
    const instrument = em.create(Instrument, req.body);
    await em.flush();
    res.status(201).json(instrument);
  }

  static async update(req: Request, res: Response) {
    const { name } = req.params;
    const { newName } = req.body;

    const instrument = await em.findOneOrFail(Instrument, { name });

    em.assign(instrument, { name: newName });
    await em.flush();
    res.status(201).json(instrument);
  }

  static async delete(req: Request, res: Response) {
    const { name } = req.params;

    const instrument = await em.findOneOrFail(Instrument, { name });

    await em.removeAndFlush(instrument);
    res.status(201).json({ message: "Instrumento borrado correctamente" });
  }
}
