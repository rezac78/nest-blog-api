import { Module } from "@nestjs/common";
import { ToolsController } from "./tools.controller";
import { ToolsService } from "./tools.service";
import { UploadsModule } from "../uploads/uploads.module";
import { PrismaModule } from "database/prisma/prisma.module";
import { PrismaService } from "database/prisma/prisma.service";

@Module({
  imports: [PrismaModule, UploadsModule],
  controllers: [ToolsController],
  providers: [ToolsService, PrismaService],
})
export class ToolsModule {}
