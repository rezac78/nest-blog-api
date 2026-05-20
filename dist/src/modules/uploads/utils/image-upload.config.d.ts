import type { Request } from "express";
import type { FileFilterCallback } from "multer";
export declare const imageUploadConfig: {
    storage: import("multer").StorageEngine;
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => void;
    limits: {
        fileSize: number;
    };
};
