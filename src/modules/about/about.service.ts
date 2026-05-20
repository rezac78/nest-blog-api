import { Injectable } from "@nestjs/common";
import { PrismaService } from "database/prisma/prisma.service";
import { UpsertAboutDto } from "./dto/about.dto";

@Injectable()
export class AboutService {
  constructor(private prisma: PrismaService) {}

  async getAbout() {
    return this.prisma.about.findFirst({
      include: {
        jobs: true,
        educations: true,
      },
    });
  }

  async upsertAbout(dto: UpsertAboutDto) {
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
}
