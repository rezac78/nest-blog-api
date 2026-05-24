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
  @UseInterceptors(FileInterceptor("image", imageUploadConfig))
  create(
    @Body() dto: CreateProjectDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.projectService.create(dto, file);
  }
  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Get(":slug")
  findOne(@Param("slug") slug: string) {
    return this.projectService.findOne(slug);
  }

  @Patch(":slug")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor("image", imageUploadConfig))
  update(
    @Param("slug") slug: string,
    @Body() dto: UpdateProjectDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.projectService.update(slug, dto, file);
  }

  @Delete(":slug")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param("slug") slug: string) {
    return this.projectService.remove(slug);
  }
}
