import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Musician } from "../models/musician.entity.js";
import { Experience } from "../enums/experience.enum.js";
import { Career } from "../models/career.entity.js";

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
    if (instruments) filters.instruments = { $in: instruments };
    if (genres) filters.genres = { $in: genres };
    if (experience) filters.experience = <Experience>experience;
    if (lookingBands) filters.lookingBands = Boolean(lookingBands);

    const musicians = await em.find(Musician, filters, {
      populate: ["instruments", "genres"],
    });
    res.status(200).json(musicians);
  }

  static async getById(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);
    const musician = await em.findOneOrFail(
      Musician,
      { id },
      { populate: ["genres", "instruments", "career"] }
    );

    res.status(200).json(musician);
  }

  static async createUpdateProfile(req: Request, res: Response) {
    const emFork = em.fork();
    const { id } = req.user;
    const { career } = req.body;
    const musician = await emFork.findOneOrFail(Musician, id);

    let updatedMusician = {
      ...req.body,
      isProfileSet: true,
    };

    if (req.file?.path) {
      updatedMusician = { ...updatedMusician, imagePath: req.file.path };
    }

    if (career) {
      if (!musician.career.isInitialized()) {
        await musician.career.init();
      }

      const careers = JSON.parse(career);
      const careersMap = careers.map(
        ({ title, description, startDate, endDate }: any) => {
          const careerObj = new Career();
          Object.assign(careerObj, {
            title,
            description,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            musician,
          });
          return careerObj;
        }
      );

      careersMap.forEach((career: Career) => {
        musician.career.add(career);
      });

      updatedMusician = { ...updatedMusician, career: musician.career };
    }

    emFork.assign(musician, updatedMusician);

    await emFork.flush();
    res.status(200).json(musician);
  }

  static async getMoreInfo(req: Request, res: Response) {
    const { id } = req.params;
    const { bio, career, instruments, lookingBands } = await em.findOneOrFail(
      Musician,
      Number.parseInt(id),
      { populate: ["career", "instruments"] }
    );

    res.status(200).json({ bio, career, instruments, lookingBands });
  }
}
