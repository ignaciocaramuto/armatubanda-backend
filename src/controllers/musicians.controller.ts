import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Musician } from "../models/musician.entity.js";
import path from "path";
import fs from "fs";
import { __dirname } from "../temp/images/dirname.js";

const em = orm.em;
export class MusicianController {
  static async getAll(req: Request, res: Response) {
    const musicians = await em.find(Musician, {});
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
    const musician = await emFork.findOneOrFail(Musician, { id });
    let updatedMusician = { ...req.body, isProfileSet: true };

    // TODO: This creates a new image and persists the previous one in table
    if (req.file) {
      const image = {
        name: req.file.filename,
        type: req.file.mimetype,
        data: fs.readFileSync(path.join(__dirname, req.file.filename)),
      };
      updatedMusician = { ...updatedMusician, image };
    }

    emFork.assign(musician, updatedMusician);
    await emFork.flush();
    res.status(200).json(musician);
  }
}
