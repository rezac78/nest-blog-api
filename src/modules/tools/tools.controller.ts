import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ToolsService } from "./tools.service";
import { CreateToolDto } from "./dto/create-tool.dto";
import { Role } from "src/common/enum/role.enum";
import { Roles } from "src/common/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { imageUploadConfig } from "../uploads/utils/image-upload.config";
import { UpdateToolDto } from "./dto/update-tool.dto";

@Controller("tools")
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}
  @Get()
  async getAll() {
    return this.toolsService.findAll();
  }
  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor("image", imageUploadConfig))
  async create(
    @Body() dto: CreateToolDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.toolsService.Create(dto, file);
  }
  @Get(":slug")
  async findOne(@Param("slug") slug: string) {
    return this.toolsService.findOne(slug);
  }
  @Patch(":slug")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor("image", imageUploadConfig))
  async update(
    @Param("slug") slug: string,
    @Body() dto: UpdateToolDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.toolsService.update(slug, dto, file);
  }
  @Delete(":slug")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param("slug") slug: string) {
    return this.toolsService.delete(slug);
  }
}
