import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Comment } from "../models/comment.entity.js";

const em = orm.em;

export class CommentController {
  static async getAll(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);
    const comments = await em.find(Comment, { musician: id });
    res.status(200).json(comments);
  }

  static async create(req: Request, res: Response) {
    const { comment } = req.body;
    const id = Number.parseInt(req.params.id);
    const authorId = req.user.id;

    em.create(Comment, { comment, musician: id, author: authorId });
    await em.flush();

    res.status(201).json({ message: "Comentario agregado correctamente" });
  }
}
