import { NextFunction, Request, Response } from "express";
import { Schema } from "yup";

export const validation =
  (schema: Schema) => async (req: Request, _: any, next: NextFunction) => {
    const { body } = req;

    try {
      await schema.validate(body);
      next();
    } catch (error: any) {
      next(error);
    }
  };
