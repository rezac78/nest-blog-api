import { BadRequestException } from "@nestjs/common";
import { memoryStorage } from "multer";
import type { Request } from "express";
import type { FileFilterCallback } from "multer";

export const imageUploadConfig = {
  storage: memoryStorage(),
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    const allowedMime = ["image/jpeg", "image/png", "image/webp"];
    const allowedExt = /\.(jpg|jpeg|png|webp)$/i;

    if (!allowedMime.includes(file.mimetype)) {
      return cb(new BadRequestException("Invalid file type"));
    }

    if (!allowedExt.test(file.originalname)) {
      return cb(new BadRequestException("Invalid file extension"));
    }

    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
};
