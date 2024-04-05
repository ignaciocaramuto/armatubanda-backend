import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Musician } from "../models/musician.entity.js";
import { Experience } from "../enums/experience.enum.js";

const em = orm.em;
export class MusicianController {
  static async getAll(req: Request, res: Response) {
    const {
      firstName,
      country,
      state,
      city,
      instruments,
      genres,
      experience,
      lookingBands,
    } = req.query;

    const filters: Record<string, any> = {};

    if (firstName) filters.firstName = { $like: `%${firstName}%` };
    if (country) filters.country = country;
    if (state) filters.state = state;
    if (city) filters.city = city;
    if (instruments) filters.instruments = instruments;
    if (genres) filters.genres = genres;
    if (experience) filters.experience = <Experience>experience;
    if (lookingBands) filters.lookingBands = Boolean(lookingBands);

    const musicians = await em.find(Musician, filters);
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
