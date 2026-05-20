import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "database/prisma/prisma.service"; // مسیر PrismaService خودت را اصلاح کن
import { join } from "path";
import { randomUUID } from "crypto";
import * as fs from "fs";
import sharp from "sharp";

@Injectable()
export class UploadsService {
  constructor(private prisma: PrismaService) {}

  private ensureDir(folder: string) {
    const dir = join(process.cwd(), `uploads/${folder}`);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    return dir;
  }

  async processImage(
    file: Express.Multer.File,
    folder: string,
    width: number,
    height?: number,
  ): Promise<string> {
    const dir = this.ensureDir(folder);

    const fileName = `${randomUUID()}.webp`;
    const filePath = join(dir, fileName);

    const image = sharp(file.buffer, {
      limitInputPixels: 268402689,
    });

    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      throw new BadRequestException("Invalid image file");
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

  deleteFile(path: string) {
    try {
      const fullPath = join(process.cwd(), path.replace(/^\//, ""));

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (error) {
      console.error("File delete error:", error);
    }
  }

  async deleteOldAvatar(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    });

    if (!user?.avatar) return;

    this.deleteFile(user.avatar);
  }

  async updateUserAvatar(userId: string, avatarPath: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarPath },
    });
  }
}
