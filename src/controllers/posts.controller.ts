import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Musician } from "../models/musician.entity.js";
import { Post } from "../models/post.entity.js";

const em = orm.em;

export class PostController {
  static async getAll(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);
    const posts = await em.find(Post, { musician: id });
    res.status(200).json(posts);
  }

  static async create(req: Request, res: Response) {
    const { videoUrl } = req.body;
    const { id } = req.user;

    await em.findOneOrFail(Musician, id);
    em.create(Post, { videoUrl, musician: id });
    await em.flush();

    res.status(201).json({ message: "Posteo realizado correctamente" });
  }
}
