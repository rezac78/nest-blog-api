import { Module } from "@nestjs/common";
import { ProjectController } from "./project.controller";
import { PrismaService } from "database/prisma/prisma.service";
import { ProjectService } from "./project.service";
import { UploadsModule } from "../uploads/uploads.module";
import { PrismaModule } from "database/prisma/prisma.module";

@Module({
  imports: [PrismaModule, UploadsModule],
  controllers: [ProjectController],
  providers: [ProjectService, PrismaService],
})
export class ProjectModule {}
