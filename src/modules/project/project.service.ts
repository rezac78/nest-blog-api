import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { PrismaService } from "database/prisma/prisma.service";
import { UploadsService } from "../uploads/uploads.service";

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private uploadsService: UploadsService,
  ) {}
  async create(dto: CreateProjectDto, file?: Express.Multer.File) {
    const { tools, links, ...projectData } = dto;
    let imagePath: string | undefined;

    if (file) {
      imagePath = await this.uploadsService.processImage(file, "tool", 800);
    }
    try {
      const project = await this.prisma.project.create({
        data: {
          ...projectData,
          ...(imagePath && { image: imagePath }),
          links: links
            ? {
                create: links,
              }
            : undefined,

          tools: tools
            ? {
                create: tools.map((toolId) => ({
                  tool: { connect: { id: toolId } },
                })),
              }
            : undefined,
        },
        include: {
          links: true,
          tools: { include: { tool: true } },
        },
      });
      return {
        message: "created successfully",
        data: project,
      };
    } catch (err) {
      if (imagePath) {
        this.uploadsService.deleteFile(imagePath);
      }
      console.error(err);
    }
  }
  async findAll() {
    return this.prisma.project.findMany({
      include: {
        links: true,
        tools: {
          include: {
            tool: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  async findOne(slug: string) {
    return this.prisma.project.findUnique({
      where: { slug },
      include: {
        links: true,
        tools: {
          include: { tool: true },
        },
      },
    });
  }

  async update(
    slug: string,
    dto: UpdateProjectDto,
    file?: Express.Multer.File,
  ) {
    const project = await this.findOne(slug);
    const { tools, links, ...projectData } = dto;

    let imagePath: string | undefined;

    if (file) {
      imagePath = await this.uploadsService.processImage(file, "tool", 800);
    }
    try {
      const updatedProject = await this.prisma.project.update({
        where: { id: project.id },
        data: {
          ...projectData,
          ...(imagePath && { image: imagePath }),
          links: links
            ? {
                deleteMany: {},
                create: links,
              }
            : undefined,

          tools: tools
            ? {
                deleteMany: {},
                create: tools.map((toolId) => ({
                  tool: { connect: { id: toolId } },
                })),
              }
            : undefined,
        },
        include: {
          links: true,
          tools: { include: { tool: true } },
        },
      });
      if (imagePath && updatedProject.image) {
        this.uploadsService.deleteFile(updatedProject.image);
      }
      return {
        message: "Update successfully",
        data: updatedProject,
      };
    } catch (error) {
      if (imagePath) {
        this.uploadsService.deleteFile(imagePath);
      }
      console.error(error);
    }
  }
  async uploadImage(id: string, file: Express.Multer.File) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException("project not found");
    }
    if (!file) {
      throw new BadRequestException("Image file is required");
    }

    const imagePath = await this.uploadsService.processImage(
      file,
      "project",
      800,
    );
    if (project.image) {
      await this.uploadsService.deleteFile(project.image);
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        image: imagePath,
      },
    });
  }
  async remove(id: string) {
    return this.prisma.project.delete({
      where: { id },
    });
  }
}
