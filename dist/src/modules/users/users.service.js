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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma/prisma.service");
const role_enum_1 = require("../../common/enum/role.enum");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(userId) {
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
            throw new common_1.NotFoundException("کاربر پیدا نشد");
        }
        return user;
    }
    async updateProfile(userId, dto) {
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
            throw new common_1.NotFoundException("کاربر پیدا نشد");
        }
        return {
            message: "پروفایل با موفقیت بروزرسانی شد",
            data: user,
        };
    }
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
        }
        catch (err) {
            console.log(err);
        }
    }
    async getUserById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user)
            throw new common_1.NotFoundException("کاربر پیدا نشد");
        return user;
    }
    async updateUser(id, dto) {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                ...dto,
                birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException("کاربر پیدا نشد");
        }
        return user;
    }
    async deleteUser(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException("کاربر پیدا نشد");
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
    async updateUserRole(adminId, targetUserId, role) {
        if (adminId === targetUserId) {
            throw new common_1.BadRequestException("شما نمی‌توانید نقش خودتان را تغییر دهید");
        }
        const targetUser = await this.prisma.user.findUnique({
            where: { id: targetUserId },
        });
        if (!targetUser) {
            throw new common_1.NotFoundException("کاربر پیدا نشد");
        }
        const adminRole = await this.prisma.role.findUnique({
            where: { name: role_enum_1.Role.ADMIN },
        });
        if (!adminRole) {
            throw new common_1.NotFoundException("نقش ادمین در سیستم پیدا نشد");
        }
        const targetRoles = await this.prisma.userRole.findMany({
            where: { userId: targetUserId },
        });
        const isAdmin = targetRoles.some((r) => r.roleId === adminRole.id);
        if (isAdmin && role !== role_enum_1.Role.ADMIN) {
            const adminCount = await this.prisma.userRole.count({
                where: { roleId: adminRole.id },
            });
            if (adminCount <= 1) {
                throw new common_1.BadRequestException("سیستم باید حداقل یک مدیر داشته باشد");
            }
        }
        const newRole = await this.prisma.role.findUnique({
            where: { name: role },
        });
        if (!newRole) {
            throw new common_1.BadRequestException("نقش نامعتبر است");
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map