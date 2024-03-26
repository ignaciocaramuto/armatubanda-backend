import { Request } from "express";
import multer from "multer";
import { __dirname } from "../temp/images/dirname.js";

const imageFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
  },
});

export const uploadFile = multer({ storage: storage, fileFilter: imageFilter });
