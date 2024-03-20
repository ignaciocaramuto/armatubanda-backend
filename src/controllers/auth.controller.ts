import { Request, Response } from "express";
import { orm } from "../shared/db/orm.js";
import { Musician } from "../models/musician.entity.js";
import { Role } from "../enums/role.enum.js";
import { createHash } from "crypto";
import jsonwebtoken from "jsonwebtoken";

const { sign } = jsonwebtoken;
const em = orm.em;

export class AuthController {
  static async register(req: Request, res: Response) {
    const { email, password } = req.body;
    AuthController.requiredFieldsValidation(email, password, res);

    const duplicate = await em.findOne(Musician, { email });
    if (duplicate) {
      return res
        .status(409)
        .json({ message: `El email ${email} ya fue utilizado.` });
    }

    const hashedPassword = createHash("md5").update(password).digest("hex");

    const musician: any = {
      email,
      password: hashedPassword,
      role: Role.USER,
      isProfileSet: false,
      isEmailConfirmed: false,
    };

    try {
      const registeredMusician = em.create(Musician, musician);
      await em.flush();
      res.status(201).json(registeredMusician);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    AuthController.requiredFieldsValidation(email, password, res);

    try {
      const musician = await em.findOneOrFail(Musician, { email });
      const hashedPassword = createHash("md5").update(password).digest("hex");

      if (hashedPassword !== musician.password) {
        return res
          .status(401)
          .json({ message: "Usuario y/o contraseña incorrectos" });
      }

      const token = sign({ email }, "secret", { expiresIn: "2h" });
      res.status(200).json({ token });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
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
