import { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";

const { verify } = jsonwebtoken;

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.header("Authorization") || "";
  const token = header.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado." });
  }

  try {
    const payload = verify(token, "secret");
    req.body.email = payload.sub;
    next();
  } catch (error: any) {
    res.status(403).json({ message: "El Token no es válido." });
  }
};
