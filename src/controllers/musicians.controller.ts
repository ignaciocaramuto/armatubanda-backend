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

  static async create(req: Request, res: Response) {
    const musician = em.create(Musician, req.body);
    await em.flush();
    res.status(201).json(musician);
  }

  /* 
    TODO: Ask if this is ok, to create a profile by a PUT method because Musician is already created when registered.
    With this method, user can update email and password and will be stored in db without hashing.
    Posible solution: Custom Validation.
  */
  static async createUpdateProfile(req: Request, res: Response) {
    const emFork = em.fork();
    const { id } = req.user;
    const musician = await emFork.findOneOrFail(Musician, { id });
    let updatedMusician = { ...req.body, isProfileSet: true };

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

  // TODO: Ask if this should be in a CommentController
  static async uploadComment(req: Request, res: Response) {}
}
