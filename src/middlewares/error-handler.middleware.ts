import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error.js";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    error.name === "JsonWebTokenError" ||
    error.name === "TokenExpiredError"
  ) {
    return res
      .status(403)
      .json({ message: "El Token no es válido o ha expirado." });
  }

  if (error.name === "NotFoundError" || error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  return res.status(500).json({
    message:
      "Hubo un error en el servidor. Por favor inténtelo de nuevo más tarde.",
  });
};
