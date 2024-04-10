import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Musician } from "../models/musician.entity.js";
import { Role } from "../enums/role.enum.js";
import { createHash } from "crypto";
import jsonwebtoken from "jsonwebtoken";
import { AppError } from "../utils/app-error.js";

const { sign } = jsonwebtoken;
const em = orm.em;

export class AuthController {
  static async register(req: Request, res: Response) {
    const { email, password } = req.body;
    const duplicate = await em.findOne(Musician, { email });

    if (duplicate) {
      throw new AppError(`El email ${email} ya fue utilizado.`, 409);
    }

    const hashedPassword = createHash("md5").update(password).digest("hex");

    const musician: any = {
      email,
      password: hashedPassword,
      role: Role.USER,
      isProfileSet: false,
    };

    const registeredMusician = em.create(Musician, musician);
    await em.flush();
    res.status(201).json(registeredMusician);
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const musician = await em.findOneOrFail(Musician, { email });
    const hashedPassword = createHash("md5").update(password).digest("hex");

    if (hashedPassword !== musician.password) {
      throw new AppError("Email y/o contraseña incorrectos", 401);
    }

    const token = sign({ id: musician.id, email }, "secret", {
      expiresIn: "2h",
    });

    res.status(200).json({
      id: musician.id,
      token,
      email,
      role: musician.role,
      isProfileSet: musician.isProfileSet,
      firstName: musician.firstName,
      lastName: musician.lastName,
      imagePath: musician.imagePath,
    });
  }

  static async getCurrentMusician(req: Request, res: Response) {
    const { id } = req.user;

    const { email, role, isProfileSet, firstName, lastName, imagePath } =
      await em.findOneOrFail(Musician, id);
    res.status(200).json({
      id,
      email,
      role,
      isProfileSet,
      firstName,
      lastName,
      imagePath,
    });
  }
}
