import {
  Body,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "database/prisma/prisma.service";
import { CreateToolDto } from "./dto/create-tool.dto";
import { generateSlug } from "src/common/utils/slug.util";
import { Prisma } from "@prisma/client";
import { UploadsService } from "../uploads/uploads.service";
import { UpdateToolDto } from "./dto/update-tool.dto";

@Injectable()
export class ToolsService {
  constructor(
    private prisma: PrismaService,
    private uploadsService: UploadsService,
  ) {}
  async Create(dto: CreateToolDto, file?: Express.Multer.File) {
    const slug = generateSlug(dto.name);

    let imagePath: string | undefined;

    if (file) {
      imagePath = await this.uploadsService.processImage(file, "tool", 800);
    }

    try {
      const tool = await this.prisma.tool.create({
        data: {
          name: dto.name,
          slug,
          ...(imagePath && { image: imagePath }),
        },
      });

      return {
        message: "created successfully",
        data: tool,
      };
    } catch (error) {
      if (imagePath) {
        this.uploadsService.deleteFile(imagePath);
      }

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
  async update(slug: string, dto: UpdateToolDto, file?: Express.Multer.File) {
    const tool = await this.findOne(slug);

    let imagePath: string | undefined;

    if (file) {
      imagePath = await this.uploadsService.processImage(file, "tool", 800);
    }

    const newSlug = dto.name ? generateSlug(dto.name) : undefined;

    try {
      const updatedTool = await this.prisma.tool.update({
        where: { id: tool.id },
        data: {
          ...(dto.name && { name: dto.name }),
          ...(newSlug && { slug: newSlug }),
          ...(imagePath && { image: imagePath }),
        },
      });

      if (imagePath && tool.image) {
        this.uploadsService.deleteFile(tool.image);
      }

      return {
        message: "Update successfully",
        data: updatedTool,
      };
    } catch (error) {
      if (imagePath) {
        this.uploadsService.deleteFile(imagePath);
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("Slug already exists");
      }

      throw error;
    }
  }
  async delete(slug: string) {
    const tool = await this.findOne(slug);

    const deletedTool = await this.prisma.tool.delete({
      where: { id: tool.id },
    });

    if (tool.image) {
      this.uploadsService.deleteFile(tool.image);
    }

    return {
      message: "Deleted successfully",
      data: deletedTool,
    };
  }
}
