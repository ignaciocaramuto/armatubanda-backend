import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Comment } from "../models/comment.entity.js";

const em = orm.em;

export class CommentController {
  static async getAllFromMusician(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);
    const comments = await em.find(Comment, { musician: id });
    res.status(200).json(comments);
  }

  static async getAllFromBand(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);
    const comments = await em.find(Comment, { band: id });
    res.status(200).json(comments);
  }

  static async createForMusician(req: Request, res: Response) {
    const musicianId = Number.parseInt(req.params.id);
    const { comment } = req.body;
    const { id } = req.user;

    em.create(Comment, { comment, author: id, musician: musicianId });
    await em.flush();

    const comments = await em.find(
      Comment,
      { musician: musicianId },
      { populate: ["author"] }
    );
    res.status(201).json(comments);
  }

  static async createForBand(req: Request, res: Response) {
    const bandId = Number.parseInt(req.params.id);
    const { comment } = req.body;
    const { id } = req.user;

    em.create(Comment, { comment, author: id, band: bandId });
    await em.flush();

    const comments = await em.find(
      Comment,
      { band: bandId },
      { populate: ["author"] }
    );
    res.status(201).json(comments);
  }
}
