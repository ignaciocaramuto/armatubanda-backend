import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Musician } from "../models/musician.entity.js";

const em = orm.em;

export class MusicianController {
  static async getAll(req: Request, res: Response) {
    try {
      const musicians = await em.find(Musician, {});
      res.status(200).json(musicians);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const musician = "";

    if (!musician) {
      return res.status(404).json({ message: "Músico no encontrado" });
    }

    res.json(musician);
  }

  static async create(req: Request, res: Response) {
    try {
      const musician = em.create(Musician, req.body);
      await em.flush();
      res.status(201).json(musician);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async update(req: Request, res: Response) {}
}
