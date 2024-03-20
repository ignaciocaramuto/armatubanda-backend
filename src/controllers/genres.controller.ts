import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Genre } from "../models/genre.entity.js";

const em = orm.em;

export class GenreController {
  static async getAll(req: Request, res: Response) {
    try {
      const { name } = req.params;
      const genres = await em.find(Genre, { name });
      res.status(200).json(genres);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const genre = em.create(Genre, req.body);
      await em.flush();
      res.status(201).json(genre);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
