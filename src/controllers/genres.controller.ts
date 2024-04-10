import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Genre } from "../models/genre.entity.js";

const em = orm.em;

export class GenreController {
  static async getAll(req: Request, res: Response) {
    const genres = await em.findAll(Genre);
    res.status(200).json(genres);
  }

  static async create(req: Request, res: Response) {
    const genre = em.create(Genre, req.body);
    await em.flush();
    res.status(201).json(genre);
  }

  static async update(req: Request, res: Response) {
    const { name } = req.params;
    const { newName } = req.body;

    const genre = await em.findOneOrFail(Genre, { name });

    em.assign(genre, { name: newName });
    await em.flush();
    res.status(201).json(genre);
  }

  static async delete(req: Request, res: Response) {
    const { name } = req.params;

    const genre = await em.findOneOrFail(Genre, { name });

    await em.removeAndFlush(genre);
    res.status(201).json({ message: "Instrumento borrado correctamente" });
  }
}
