import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Band } from "../models/band.entity.js";
import { AppError } from "../utils/app-error.js";
import { Application } from "../models/application.entity.js";
import { Advertisement } from "../models/advertisement.entity.js";
import { Invitation } from "../models/invitation.entity.js";
import { Post } from "../models/post.entity.js";
import { Comment } from "../models/comment.entity.js";

const em = orm.em;

export class BandController {
  static async getAll(req: Request, res: Response) {
    const { name, country, state, city, genres, lookingMusicians } = req.query;

    const filters: Record<string, any> = {};

    if (name) filters.name = { $like: `%${name}%` };
    if (country) filters.country = country;
    if (state) filters.state = state;
    if (city) filters.city = city;
    if (genres) filters.genres = { $in: (genres as string).split(",") };
    if (lookingMusicians)
      filters.lookingMusicians = JSON.parse(lookingMusicians as string);

    const bands = await em.find(Band, filters);
    res.status(200).json(bands);
  }

  static async getById(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);
    const band = await em.findOneOrFail(
      Band,
      { id },
      { populate: ["genres", "leader", "members"] }
    );

    res.status(200).json(band);
  }

  static async create(req: Request, res: Response) {
    const emFork = em.fork();
    const { id } = req.user;

    const band = emFork.create(Band, {
      ...req.body,
      leader: id,
      imagePath: req.file?.path,
      genres: req.body.genres?.split(","),
    });

    await emFork.flush();
    res.status(201).json(band);
  }

  static async edit(req: Request, res: Response) {
    const emFork = em.fork();
    const { id } = req.user;
    const { genres } = req.body;
    const bandId = Number.parseInt(req.params.id);

    const band = await emFork.findOneOrFail(Band, { id: bandId, leader: id });

    let updatedBand = {
      ...req.body,
      lookingMusicians: JSON.parse(req.body.lookingMusicians),
      genres: genres?.split(","),
    };

    if (req.file?.path) {
      updatedBand = { ...updatedBand, imagePath: req.file.path };
    }

    await emFork.assign(band, updatedBand);
    await emFork.flush();
    res.status(201).json(band);
  }

  static async leave(req: Request, res: Response) {
    const memberId = req.user.id;
    const bandId = Number.parseInt(req.params.id);

    const band = await em.findOneOrFail(Band, { id: bandId });
    const { members } = band;
    await members.init();

    const member = members.getItems().find(({ id }) => id === memberId);

    if (!member) {
      throw new AppError(`No eres miembro de ${band.name}`, 404);
    }

    const application = await em.findOneOrFail(Application, {
      applicant: member.id,
    });

    members.remove(member);
    await em.remove(application);
    await em.flush();
    res.status(201).json({ message: "¡Banda dejada correctamente!" });
  }

  static async remove(req: Request, res: Response) {
    const { id } = req.params;

    const band = await em.findOneOrFail(Band, { id: Number.parseInt(id) });
    const advertisements = await em.find(Advertisement, { band: band.id });
    const invitations = await em.find(Invitation, { band: band.id });
    const posts = await em.find(Post, { band: band.id });
    const comments = await em.find(Comment, { band: band.id });

    em.remove(advertisements);
    em.remove(invitations);
    em.remove(posts);
    em.remove(comments);
    await em.removeAndFlush(band);
    res.status(200).json({ message: "Banda borrada correctamente" });
  }
}
