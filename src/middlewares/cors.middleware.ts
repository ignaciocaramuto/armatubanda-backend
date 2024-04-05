import cors from "cors";
import { AppError } from "../utils/app-error.js";

export const corsMiddleware = () =>
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = ["http://localhost:4200"];

      if (!origin) {
        return callback(null, true);
      }

      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      return callback(new AppError("No permitido por CORS.", 403));
    },
  });
