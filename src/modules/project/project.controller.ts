import {
  BadRequestException,
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
import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enum/role.enum";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { imageUploadConfig } from "../uploads/utils/image-upload.config";

@Controller("project")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() dto: CreateProjectDto) {
    return this.projectService.create(dto);
  }
  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.projectService.findOne(id);
  }

  @Patch(":id")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param("id") id: string, @Body() dto: UpdateProjectDto) {
    return this.projectService.update(id, dto);
  }

  @Post(":id/image")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor("image", imageUploadConfig))
  uploadImage(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.projectService.uploadImage(id, file);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param("id") id: string) {
    return this.projectService.remove(id);
  }
}
