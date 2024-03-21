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
    AuthController.requiredFieldsValidation(email, password, res);

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
      isEmailConfirmed: false,
    };

    const registeredMusician = em.create(Musician, musician);
    await em.flush();
    res.status(201).json(registeredMusician);
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    AuthController.requiredFieldsValidation(email, password, res);

    const musician = await em.findOneOrFail(Musician, { email });
    const hashedPassword = createHash("md5").update(password).digest("hex");

    if (hashedPassword !== musician.password) {
      throw new AppError("Usuario y/o contraseña incorrectos", 401);
    }

    const token = sign({ email }, "secret", { expiresIn: "2h" });

    res.status(200).json({ token });
  }

  static requiredFieldsValidation(
    email: string,
    password: string,
    res: Response
  ) {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Usuario y contraseña son requeridos." });
    }
  }
}
