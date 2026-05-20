"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma/prisma.service");
const path_1 = require("path");
const crypto_1 = require("crypto");
const fs = __importStar(require("fs"));
const sharp_1 = __importDefault(require("sharp"));
let UploadsService = class UploadsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    ensureDir(folder) {
        const dir = (0, path_1.join)(process.cwd(), `uploads/${folder}`);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        return dir;
    }
    async processImage(file, folder, width, height) {
        const dir = this.ensureDir(folder);
        const fileName = `${(0, crypto_1.randomUUID)()}.webp`;
        const filePath = (0, path_1.join)(dir, fileName);
        const image = (0, sharp_1.default)(file.buffer, {
            limitInputPixels: 268402689,
        });
        const metadata = await image.metadata();
        if (!metadata.width || !metadata.height) {
            throw new common_1.BadRequestException("Invalid image file");
        }
        await image
            .rotate()
            .resize(width, height ?? width, {
            fit: "cover",
            position: "center",
        })
            .webp({ quality: 80 })
            .toFile(filePath);
        return `/uploads/${folder}/${fileName}`;
    }
    deleteFile(path) {
        try {
            const fullPath = (0, path_1.join)(process.cwd(), path.replace(/^\//, ""));
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }
        catch (error) {
            console.error("File delete error:", error);
        }
    }
    async deleteOldAvatar(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { avatar: true },
        });
        if (!user?.avatar)
            return;
        this.deleteFile(user.avatar);
    }
    async updateUserAvatar(userId, avatarPath) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { avatar: avatarPath },
        });
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map