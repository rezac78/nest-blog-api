import {
  Controller,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Put,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Express } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { UploadsService } from "./uploads.service";
import { imageUploadConfig } from "./utils/image-upload.config";
@Controller("uploads")
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Put("avatar")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("avatar", imageUploadConfig))
  async updateAvatar(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: { userId: string },
  ) {
    if (!file) throw new BadRequestException("No file uploaded");
    await this.uploadsService.deleteOldAvatar(user.userId);
    const avatarPath = await this.uploadsService.processImage(
      file,
      "avatars",
      256,
      256,
    );
    await this.uploadsService.updateUserAvatar(user.userId, avatarPath);
    return {
      message: "Avatar updated",
      filePath: avatarPath,
    };
  }
}
