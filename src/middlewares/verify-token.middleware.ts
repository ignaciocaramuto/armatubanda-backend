import { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { AppError } from "../utils/app-error.js";

const { verify } = jsonwebtoken;

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.header("Authorization") || "";
  const token = header.split(" ")[1];

  if (!token) {
    throw new AppError("Token no proporcionado.", 401);
  }

  verify(token, "secret");
  next();
};
