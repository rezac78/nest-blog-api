import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { PrismaService } from "database/prisma/prisma.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Role } from "src/common/enum/role.enum";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        mobile: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        gender: true,
        birthDate: true,
        avatar: true,
        githubLink: true,
        linkedInLink: true,
        country: true,
        city: true,
        jobStatus: true,
        description: true,
        whatIveBeenWorkingOn: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException("کاربر پیدا نشد");
    }

    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        username: dto.username,
        gender: dto.gender,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        avatar: dto.avatar,
        githubLink: dto.githubLink,
        linkedInLink: dto.linkedInLink,
        country: dto.country,
        city: dto.city,
        jobStatus: dto.jobStatus,
        description: dto.description,
        whatIveBeenWorkingOn: dto.whatIveBeenWorkingOn,
      },
      select: {
        id: true,
        mobile: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        gender: true,
        birthDate: true,
        avatar: true,
        githubLink: true,
        linkedInLink: true,
        country: true,
        city: true,
        jobStatus: true,
        description: true,
        whatIveBeenWorkingOn: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException("کاربر پیدا نشد");
    }
    return {
      message: "پروفایل با موفقیت بروزرسانی شد",
      data: user,
    };
  }
  // admin methods

  async getUsers() {
    try {
      return this.prisma.user.findMany({
        select: {
          id: true,
          mobile: true,
          email: true,
          firstName: true,
          lastName: true,
          isActive: true,
          createdAt: true,
          roles: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException("کاربر پیدا نشد");

    return user;
  }
  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      },
    });
    if (!user) {
      throw new NotFoundException("کاربر پیدا نشد");
    }
    return user;
  }
  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("کاربر پیدا نشد");
    }

    await this.prisma.$transaction([
      this.prisma.userRole.deleteMany({
        where: { userId: id },
      }),
      this.prisma.user.delete({
        where: { id },
      }),
    ]);

    return {
      message: "کاربر با موفقیت حذف شد",
    };
  }

  async updateUserRole(adminId: string, targetUserId: string, role: Role) {
    if (adminId === targetUserId) {
      throw new BadRequestException("شما نمی‌توانید نقش خودتان را تغییر دهید");
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });
    if (!targetUser) {
      throw new NotFoundException("کاربر پیدا نشد");
    }

    const adminRole = await this.prisma.role.findUnique({
      where: { name: Role.ADMIN },
    });

    if (!adminRole) {
      throw new NotFoundException("نقش ادمین در سیستم پیدا نشد");
    }

    const targetRoles = await this.prisma.userRole.findMany({
      where: { userId: targetUserId },
    });
    const isAdmin = targetRoles.some((r) => r.roleId === adminRole.id);

    if (isAdmin && role !== Role.ADMIN) {
      const adminCount = await this.prisma.userRole.count({
        where: { roleId: adminRole.id },
      });

      if (adminCount <= 1) {
        throw new BadRequestException("سیستم باید حداقل یک مدیر داشته باشد");
      }
    }

    const newRole = await this.prisma.role.findUnique({
      where: { name: role },
    });
    if (!newRole) {
      throw new BadRequestException("نقش نامعتبر است");
    }

    await this.prisma.userRole.deleteMany({
      where: { userId: targetUserId },
    });

    return this.prisma.userRole.create({
      data: {
        userId: targetUserId,
        roleId: newRole.id,
      },
    });
  }
}
