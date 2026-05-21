"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma/prisma.service");
const uploads_service_1 = require("../uploads/uploads.service");
let ProjectService = class ProjectService {
    prisma;
    uploadsService;
    constructor(prisma, uploadsService) {
        this.prisma = prisma;
        this.uploadsService = uploadsService;
    }
    async create(dto) {
        const { tools, links, ...projectData } = dto;
        return this.prisma.project.create({
            data: {
                ...projectData,
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
    async findOne(id) {
        return this.prisma.project.findUnique({
            where: { id },
            include: {
                links: true,
                tools: {
                    include: { tool: true },
                },
            },
        });
    }
    async update(id, dto) {
        const { tools, links, ...projectData } = dto;
        return this.prisma.project.update({
            where: { id },
            data: {
                ...projectData,
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
    }
    async uploadImage(id, file) {
        const project = await this.prisma.project.findUnique({
            where: { id },
        });
        if (!project) {
            throw new common_1.NotFoundException("project not found");
        }
        if (!file) {
            throw new common_1.BadRequestException("Image file is required");
        }
        const imagePath = await this.uploadsService.processImage(file, "project", 800);
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
    async remove(id) {
        return this.prisma.project.delete({
            where: { id },
        });
    }
};
exports.ProjectService = ProjectService;
exports.ProjectService = ProjectService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        uploads_service_1.UploadsService])
], ProjectService);
//# sourceMappingURL=project.service.js.map