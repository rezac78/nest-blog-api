import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { UpsertAboutDto } from "./dto/about.dto";
import { AboutService } from "./about.service";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enum/role.enum";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";

@Controller("admin/about")
export class AboutAdminController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getAbout() {
    return this.aboutService.getAbout();
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  upsertAbout(@Body() dto: UpsertAboutDto) {
    return this.aboutService.upsertAbout(dto);
  }
}
