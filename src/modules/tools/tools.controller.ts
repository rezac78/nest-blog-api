import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ToolsService } from "./tools.service";
import { CreateToolDto } from "./dto/create-tool.dto";
import { Role } from "src/common/enum/role.enum";
import { Roles } from "src/common/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/roles.guard";

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
  async create(@Body() dto: CreateToolDto) {
    return this.toolsService.Create(dto);
  }
  @Get(":slug")
  async findOne(slug: string) {
    return this.toolsService.findOne(slug);
  }
  @Delete(":slug")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param("slug") slug: string) {
    return this.toolsService.delete(slug);
  }
}
