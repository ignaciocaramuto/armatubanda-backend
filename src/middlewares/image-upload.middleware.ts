import { Request } from "express";
import multer from "multer";

const imageFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images/");
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${file.originalname}`);
  },
});

export const uploadFile = multer({ storage: storage, fileFilter: imageFilter });
