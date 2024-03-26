import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Band } from "../models/band.entity.js";
import path from "path";
import fs from "fs";
import { __dirname } from "../temp/images/dirname.js";

const em = orm.em;

export class BandController {
  static async getAll(req: Request, res: Response) {
    const bands = await em.find(Band, {});
    res.status(200).json(bands);
  }

  static async getById(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);
    const band = await em.findOneOrFail(Band, { id });

    res.status(200).json(band);
  }

  static async create(req: Request, res: Response) {
    const emFork = em.fork();
    const { id } = req.user;

    let createBand = { ...req.body, leader: id };

    if (req.file) {
      const image = {
        name: req.file.filename,
        type: req.file.mimetype,
        data: fs.readFileSync(path.join(__dirname, req.file.filename)),
      };
      createBand = { ...createBand, image };
    }

    const band = emFork.create(Band, createBand);
    await emFork.flush();
    res.status(201).json(band);
  }
}
