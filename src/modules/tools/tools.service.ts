import {
  Body,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "database/prisma/prisma.service";
import { CreateToolDto } from "./dto/create-tool.dto";
import { generateSlug } from "src/common/utils/slug.util";

@Injectable()
export class ToolsService {
  constructor(private prisma: PrismaService) {}
  async Create(@Body() dto: CreateToolDto) {
    const slug = generateSlug(dto.name);
    try {
      return this.prisma.tool.create({
        data: {
          name: dto.name,
          slug,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("Slug already exists");
      }
      throw error;
    }
  }
  async findAll() {
    return this.prisma.tool.findMany({
      include: { _count: { select: { projects: true } } },
    });
  }
  async findOne(slug: string) {
    const tool = await this.prisma.tool.findUnique({ where: { slug } });
    if (!tool) throw new NotFoundException(`Tool ${slug} not found`);
    return tool;
  }
  async delete(slug: string) {
    const tool = await this.findOne(slug);
    return await this.prisma.tool.delete({
      where: { id: tool.id },
    });
  }
}
