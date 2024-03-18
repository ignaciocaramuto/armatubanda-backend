import { Request, Response } from "express";
import { Musician } from "../models/musician.js";

export class MusicianController {
  static async getAll(req: Request, res: Response) {
    const musicians = await Musician.getAll(req.query);
    return res.json(musicians);
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const musician = await Musician.getById(parseInt(id));

    if (!musician) {
      return res.status(404).json({ message: "Músico no encontrado" });
    }

    res.json(musician);
  }

  static async create(req: Request, res: Response) {}

  static async update(req: Request, res: Response) {}
}
