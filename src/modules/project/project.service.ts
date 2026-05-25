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
      imagePath = await this.uploadsService.processImage(file, "project", 800);
    }

    try {
      const project = await this.prisma.project.create({
        data: {
          ...projectData,
          ...(imagePath && { image: imagePath }),
          links: links?.length
            ? {
                create: links,
              }
            : undefined,
          tools: tools?.length
            ? {
                create: tools.map((toolId) => ({
                  tool: { connect: { id: toolId } },
                })),
              }
            : undefined,
        },
        include: {
          links: true,
          tools: {
            include: {
              tool: true,
            },
          },
        },
      });

      return {
        success: true,
        message: "created successfully",
        data: project,
      };
    } catch (error) {
      if (imagePath) {
        this.uploadsService.deleteFile(imagePath);
      }

      throw error;
    }
  }

  async findAll() {
    const projects = await this.prisma.project.findMany({
      include: {
        links: {
          select: {
            id: true,
            name: true,
            url: true,
          },
        },
        tools: {
          include: {
            tool: {
              select: {
                id: true,
                name: true,
                slug: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return projects.map((project) => ({
      ...project,
      tools: project.tools.map((item) => item.tool),
    }));
  }

  async findOne(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: {
        links: {
          select: {
            id: true,
            name: true,
            url: true,
          },
        },
        tools: {
          include: {
            tool: {
              select: {
                id: true,
                name: true,
                slug: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException(`Project ${slug} not found`);
    }

    return {
      ...project,
      tools: project.tools.map((item) => item.tool),
    };
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
      imagePath = await this.uploadsService.processImage(file, "project", 800);
    }

    try {
      const updatedProject = await this.prisma.project.update({
        where: { id: project.id },
        data: {
          ...projectData,
          ...(imagePath && { image: imagePath }),
          links: links?.length
            ? {
                deleteMany: {},
                create: links,
              }
            : undefined,
          tools: tools?.length
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
          tools: {
            include: {
              tool: true,
            },
          },
        },
      });

      if (imagePath && project.image) {
        this.uploadsService.deleteFile(project.image);
      }

      return {
        success: true,
        message: "Update successfully",
        data: updatedProject,
      };
    } catch (error) {
      if (imagePath) {
        this.uploadsService.deleteFile(imagePath);
      }

      throw error;
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
      this.uploadsService.deleteFile(project.image);
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        image: imagePath,
      },
    });
  }

  async remove(slug: string) {
    const project = await this.findOne(slug);

    const deletedProject = await this.prisma.project.delete({
      where: { id: project.id },
    });

    if (project.image) {
      this.uploadsService.deleteFile(project.image);
    }

    return {
      success: true,
      message: "Deleted successfully",
      data: deletedProject,
    };
  }
}
