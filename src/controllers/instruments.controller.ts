import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Instrument } from "../models/instrument.entity.js";

const em = orm.em;

export class InstrumentController {
  static async getAll(req: Request, res: Response) {
    try {
      const { name } = req.params;
      const instruments = await em.find(Instrument, { name });
      res.status(200).json(instruments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const instrument = em.create(Instrument, req.body);
      await em.flush();
      res.status(201).json(instrument);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
