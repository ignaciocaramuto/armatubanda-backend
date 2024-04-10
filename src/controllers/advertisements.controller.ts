import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Band } from "../models/band.entity.js";
import { Advertisement } from "../models/advertisement.entity.js";
import { Status } from "../enums/status.enum.js";
import { Musician } from "../models/musician.entity.js";
import { AdvertisementStatus } from "../enums/advertisement-status.js";

const em = orm.em;

export class AdvertisementController {
  static async getAll(req: Request, res: Response) {
    const musicianId = req.user.id;
    const { instruments, genres } = req.query;

    const filters: Record<string, any> = {};

    if (instruments)
      filters.instruments = { $in: (instruments as string).split(",") };
    if (genres) filters.genres = { $in: (genres as string).split(",") };

    const advertisements = await em.find(Advertisement, filters, {
      populate: ["band", "applications"],
    });

    const ads = await Promise.all(
      advertisements.map(
        async ({
          id,
          title,
          description,
          band,
          applications,
          createdAt,
          genres,
          instruments,
        }: Advertisement) => {
          await band.members.init();
          await applications.init();
          await band.invitations.init();

          const isLeader = band.leader.id === musicianId;

          const isMember = band.members
            .getItems()
            .some((musician: Musician) => musician.id === musicianId);

          const hasPendingApplication = applications
            .getItems()
            .some(
              ({ applicant, status }) =>
                applicant.id === musicianId && status === Status.PENDING
            );

          const hasPendingInvitation = band.invitations
            .getItems()
            .some(({ musician }) => musician.id === musicianId);

          let status = AdvertisementStatus.ELIGIGLE;

          if (isMember || isLeader) {
            status = AdvertisementStatus.MEMBER;
          } else if (hasPendingApplication) {
            status = AdvertisementStatus.PENDING_APPLICATION;
          } else if (hasPendingInvitation) {
            status = AdvertisementStatus.PENDING_INVITATION;
          }

          return {
            id,
            title,
            description,
            createdAt,
            band,
            genres,
            instruments,
            status,
          };
        }
      )
    );

    res.status(200).json(ads);
  }

  static async create(req: Request, res: Response) {
    const { id } = req.user;
    const bandId = Number.parseInt(req.params.id);

    await em.findOneOrFail(Band, { id: bandId, leader: id });

    const advertisement = await em.create(Advertisement, {
      ...req.body,
      band: bandId,
    });

    await em.flush();
    res.status(201).json(advertisement);
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.user;
    const adId = Number.parseInt(req.params.id);
    const advertisement = await em.findOneOrFail(Advertisement, { id: adId });

    await em.findOneOrFail(Band, { id: advertisement.band.id, leader: id });
    await em.removeAndFlush(advertisement);
    res.status(200).json({ message: "Aviso eliminado correctamente" });
  }

  static async getApplications(req: Request, res: Response) {
    const { id } = req.user;
    const bandId = Number.parseInt(req.params.bandId);
    const adId = Number.parseInt(req.params.id);

    await em.findOneOrFail(Band, { id: bandId, leader: id });

    const { applications } = await em.findOneOrFail(
      Advertisement,
      { id: adId, band: bandId },
      { populate: ["applications"] }
    );
    res
      .status(200)
      .json(applications.filter(({ status }) => status === Status.PENDING));
  }

  static async getAllFromBand(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);

    const ads = await em.find(Advertisement, { band: id });
    res.status(200).json(ads);
  }
}
