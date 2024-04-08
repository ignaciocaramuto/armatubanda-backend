import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Musician } from "../models/musician.entity.js";
import { Post } from "../models/post.entity.js";
import { Band } from "../models/band.entity.js";

const em = orm.em;

export class PostController {
  static async getAllFromMusician(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);
    const posts = await em.find(Post, { musician: id });
    res.status(200).json(posts);
  }

  static async getAllFromBand(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);
    const posts = await em.find(Post, { band: id });
    res.status(200).json(posts);
  }

  static async createForMusician(req: Request, res: Response) {
    const { videoUrl } = req.body;
    const { id } = req.user;

    await em.findOneOrFail(Musician, id);
    em.create(Post, { videoUrl, musician: id });
    await em.flush();

    res.status(201).json({ message: "Posteo realizado correctamente" });
  }

  static async createForBand(req: Request, res: Response) {
    const { videoUrl } = req.body;
    const musicianId = req.user.id;
    const bandId = Number.parseInt(req.params.id);

    const { id } = await em.findOneOrFail(Band, {
      id: bandId,
      leader: musicianId,
    });
    await em.findOneOrFail(Band, id);
    em.create(Post, { videoUrl, band: id });
    await em.flush();

    res.status(201).json({ message: "Posteo realizado correctamente" });
  }

  static async deleteForMusician(req: Request, res: Response) {
    const { id } = req.user;
    const postId = Number.parseInt(req.params.id);
    const post = await em.findOneOrFail(Post, { id: postId, musician: id });
    await em.removeAndFlush(post);
    res.status(200).json({ message: "Posteo eliminado correctamente" });
  }

  static async deleteForBand(req: Request, res: Response) {
    const musicianId = req.user.id;
    const bandId = Number.parseInt(req.params.bandId);

    const { id } = await em.findOneOrFail(Band, {
      id: bandId,
      leader: musicianId,
    });

    const postId = Number.parseInt(req.params.id);
    const post = await em.findOneOrFail(Post, { id: postId, band: id });
    await em.removeAndFlush(post);
    res.status(200).json({ message: "Posteo eliminado correctamente" });
  }
}
