import { NextFunction, Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Musician } from "../models/musician.entity.js";
import { Role } from "../enums/role.enum.js";

const em = orm.em;

export const adminValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.user;

  const { role } = await em.findOneOrFail(Musician, id);

  if (role === Role.USER) {
    return res
      .status(403)
      .json({ message: "No tienes permiso para realizar esta acción." });
  }

  next();
};
