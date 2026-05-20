"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageUploadConfig = void 0;
const common_1 = require("@nestjs/common");
const multer_1 = require("multer");
exports.imageUploadConfig = {
    storage: (0, multer_1.memoryStorage)(),
    fileFilter: (req, file, cb) => {
        const allowedMime = ["image/jpeg", "image/png", "image/webp"];
        const allowedExt = /\.(jpg|jpeg|png|webp)$/i;
        if (!allowedMime.includes(file.mimetype)) {
            return cb(new common_1.BadRequestException("Invalid file type"));
        }
        if (!allowedExt.test(file.originalname)) {
            return cb(new common_1.BadRequestException("Invalid file extension"));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
};
//# sourceMappingURL=image-upload.config.js.map