import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Band } from "../models/band.entity.js";

const em = orm.em;

export class BandController {
  static async getAll(req: Request, res: Response) {
    const { name, country, state, city, genres, lookingMusicians } = req.query;

    const filters: Record<string, any> = {};

    if (name) filters.name = { $like: `%${name}%` };
    if (country) filters.country = country;
    if (state) filters.state = state;
    if (city) filters.city = city;
    if (genres) filters.genres = { $in: (genres as string).split(",") };
    if (lookingMusicians) filters.lookingMusicians = Boolean(lookingMusicians);

    const bands = await em.find(Band, filters);
    res.status(200).json(bands);
  }

  static async getById(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);
    const band = await em.findOneOrFail(
      Band,
      { id },
      { populate: ["genres", "leader", "members"] }
    );

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

    // genres doens't work

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
