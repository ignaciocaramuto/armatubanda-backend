import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Musician } from "../models/musician.entity.js";
import { Experience } from "../enums/experience.enum.js";
import { Career } from "../models/career.entity.js";
import { Invitation } from "../models/invitation.entity.js";
import { Status } from "../enums/status.enum.js";
import { MusicianBandStatus } from "../enums/musician-band-status.enum.js";
import { Role } from "../enums/role.enum.js";

const em = orm.em;
export class MusicianController {
  static async getAll(req: Request, res: Response) {
    const {
      firstName,
      country,
      state,
      city,
      instruments,
      genres,
      experience,
      lookingBands,
    } = req.query;

    const filters: Record<string, any> = {};

    if (firstName) filters.firstName = { $like: `%${firstName}%` };
    if (country) filters.country = country;
    if (state) filters.state = state;
    if (city) filters.city = city;
    if (instruments)
      filters.instruments = { $in: (instruments as string).split(",") };
    if (genres) filters.genres = { $in: (genres as string).split(",") };
    if (experience) filters.experience = <Experience>experience;
    if (lookingBands) filters.lookingBands = Boolean(lookingBands);
    filters.isProfileSet = true;
    filters.role = Role.USER;

    const musicians = await em.find(Musician, filters, {
      populate: ["instruments", "genres", "comments"],
    });
    res.status(200).json(musicians);
  }

  static async getById(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);
    const musician = await em.findOneOrFail(
      Musician,
      { id },
      { populate: ["genres", "instruments", "career"] }
    );

    res.status(200).json(musician);
  }

  static async createUpdateProfile(req: Request, res: Response) {
    const emFork = em.fork();
    const { id } = req.user;
    const { instruments, genres, career } = req.body;
    const musician = await emFork.findOneOrFail(Musician, id);

    let updatedMusician = {
      ...req.body,
      instruments: instruments?.split(","),
      genres: genres?.split(","),
      lookingBands: Boolean(req.body.lookingBands),
      isProfileSet: true,
    };

    if (req.file?.path) {
      updatedMusician = { ...updatedMusician, imagePath: req.file.path };
    }

    if (career) {
      await musician.career.init();
      await musician.career.removeAll();

      const careers = JSON.parse(career);
      const careersMap = careers.map(
        ({ title, description, startDate, endDate }: any) => {
          const careerObj = new Career();
          Object.assign(careerObj, {
            title,
            description,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            musician,
          });
          return careerObj;
        }
      );

      careersMap.forEach((career: Career) => {
        musician.career.add(career);
      });

      updatedMusician = { ...updatedMusician, career: musician.career };
    }

    emFork.assign(musician, updatedMusician);

    await emFork.flush();
    res.status(200).json(musician);
  }

  static async getMoreInfo(req: Request, res: Response) {
    const { id } = req.params;
    const { bio, career, instruments, lookingBands } = await em.findOneOrFail(
      Musician,
      Number.parseInt(id),
      { populate: ["career", "instruments"] }
    );

    res.status(200).json({ bio, career, instruments, lookingBands });
  }

  static async getBandsFromMusician(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);
    const { bands, ledBands } = await em.findOneOrFail(
      Musician,
      { id },
      { populate: ["bands", "ledBands"] }
    );

    res.status(200).json([...bands, ...ledBands]);
  }

  static async getBandsFromLeaderToInviteMusician(req: Request, res: Response) {
    const { id } = req.user;
    const musicianToInviteId = Number.parseInt(req.params.id);
    const { ledBands } = await em.findOneOrFail(
      Musician,
      { id },
      { populate: ["ledBands"] }
    );

    const invitations = await em.find(Invitation, {
      musician: musicianToInviteId,
      status: Status.PENDING,
    });

    const pendingInvitationsMap: { [bandId: number]: boolean } = {};
    invitations.forEach((invitation: Invitation) => {
      pendingInvitationsMap[invitation.band.id] = true;
    });

    const bands = await Promise.all(
      ledBands.map(async (band) => {
        await band.members.init();

        const isMember = band.members
          .getItems()
          .some(({ id }: Musician) => id === musicianToInviteId);

        const hasPendingInvitation = pendingInvitationsMap[band.id] || false;

        let status = "";
        if (isMember) {
          status = MusicianBandStatus.MEMBER;
        } else if (hasPendingInvitation) {
          status = MusicianBandStatus.PENDING_INVITATION;
        } else {
          status = MusicianBandStatus.NOT_MEMBER;
        }

        return {
          id: band.id,
          name: band.name,
          imagePath: band.imagePath,
          status: status,
        };
      })
    );

    res.status(200).json(bands);
  }
}
