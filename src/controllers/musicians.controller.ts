import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Musician } from "../models/musician.entity.js";

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
    Posible solution: restringe email & password fields.
  */
  static async createProfile(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);
    const musician = await em.findOneOrFail(Musician, { id });
    em.assign(musician, { ...req.body, isProfileSet: true });
    await em.flush();
    res.status(200).json(musician);
  }

  static async update(req: Request, res: Response) {}
}
