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
exports.AboutService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma/prisma.service");
let AboutService = class AboutService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAbout() {
        return this.prisma.about.findFirst({
            include: {
                jobs: true,
                educations: true,
            },
        });
    }
    async upsertAbout(dto) {
        const existing = await this.prisma.about.findFirst();
        if (!existing) {
            return this.prisma.about.create({
                data: {
                    aboutHtml: dto.aboutHtml ?? "",
                    resumeFileBase64: dto.resumeFileBase64 ?? "",
                    resumeLink: dto.resumeLink ?? "",
                    jobs: {
                        create: dto.jobs ?? [],
                    },
                    educations: {
                        create: dto.educations ?? [],
                    },
                },
                include: {
                    jobs: true,
                    educations: true,
                },
            });
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.aboutJob.deleteMany({
                where: { aboutId: existing.id },
            });
            await tx.aboutEducation.deleteMany({
                where: { aboutId: existing.id },
            });
            return tx.about.update({
                where: { id: existing.id },
                data: {
                    aboutHtml: dto.aboutHtml ?? existing.aboutHtml,
                    resumeFileBase64: dto.resumeFileBase64 ?? existing.resumeFileBase64,
                    resumeLink: dto.resumeLink ?? existing.resumeLink,
                    jobs: {
                        create: dto.jobs ?? [],
                    },
                    educations: {
                        create: dto.educations ?? [],
                    },
                },
                include: {
                    jobs: true,
                    educations: true,
                },
            });
        });
    }
};
exports.AboutService = AboutService;
exports.AboutService = AboutService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AboutService);
//# sourceMappingURL=about.service.js.map