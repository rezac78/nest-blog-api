"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../../../database/prisma/prisma.service");
const crypto_1 = require("crypto");
const generate_otp_1 = require("./utils/generate-otp");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async sendOtp(mobile) {
        const now = new Date();
        await this.prisma.otpCode.deleteMany({
            where: {
                mobile,
                OR: [
                    { expiresAt: { lt: now } },
                    { isUsed: true },
                    { createdAt: { lt: new Date(Date.now() - 10 * 60 * 1000) } },
                ],
            },
        });
        const lastOtp = await this.prisma.otpCode.findFirst({
            where: {
                mobile,
                isUsed: false,
                expiresAt: { gt: now },
            },
            orderBy: { createdAt: "desc" },
            select: { createdAt: true },
        });
        if (lastOtp) {
            const diff = Date.now() - lastOtp.createdAt.getTime();
            if (diff < 60 * 1000) {
                throw new common_1.HttpException("لطفاً یک دقیقه بعد دوباره تلاش کنید", common_1.HttpStatus.TOO_MANY_REQUESTS);
            }
        }
        const { otp, codeHash } = await (0, generate_otp_1.generateOtp)();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
        await this.prisma.otpCode.create({
            data: {
                mobile,
                codeHash,
                expiresAt,
            },
        });
        console.log(`OTP for ${mobile}: ${otp}`);
        return {
            message: "کد با موفقیت ارسال شد",
        };
    }
    async verifyOtp(mobile, code) {
        const now = new Date();
        const otp = await this.prisma.otpCode.findFirst({
            where: {
                mobile,
                isUsed: false,
                expiresAt: { gt: now },
            },
            orderBy: { createdAt: "desc" },
        });
        if (!otp) {
            throw new common_1.BadRequestException("کد نامعتبر است یا منقضی شده است");
        }
        if (otp.attempts >= 5) {
            throw new common_1.BadRequestException("تعداد تلاش بیش از حد مجاز است. لطفاً دوباره کد دریافت کنید");
        }
        if (otp.expiresAt < new Date()) {
            throw new common_1.BadRequestException("کد منقضی شده است");
        }
        const isValid = await bcrypt.compare(code, otp.codeHash);
        if (!isValid) {
            const updatedOtp = await this.prisma.otpCode.update({
                where: { id: otp.id },
                data: {
                    attempts: {
                        increment: 1,
                    },
                },
            });
            if (updatedOtp.attempts >= 5) {
                await this.prisma.otpCode.update({
                    where: { id: otp.id },
                    data: {
                        isUsed: true,
                    },
                });
            }
            throw new common_1.BadRequestException("کد نامعتبر است یا منقضی شده است");
        }
        let user = await this.prisma.user.findUnique({
            where: { mobile },
        });
        if (!user) {
            const usersCount = await this.prisma.user.count();
            const roleName = usersCount === 0 ? "admin" : "user";
            user = await this.prisma.user.create({
                data: {
                    mobile,
                    isMobileVerified: true,
                },
            });
            const role = await this.prisma.role.findUnique({
                where: { name: roleName },
            });
            if (!role) {
                throw new common_1.InternalServerErrorException("نقش کاربر در سیستم پیدا نشد");
            }
            await this.prisma.userRole.create({
                data: {
                    userId: user.id,
                    roleId: role.id,
                },
            });
        }
        await this.prisma.otpCode.update({
            where: { id: otp.id },
            data: { isUsed: true },
        });
        const roles = await this.prisma.userRole.findMany({
            where: { userId: user.id },
            include: {
                role: true,
            },
        });
        const roleNames = roles.map((r) => r.role.name);
        const payload = {
            sub: user.id,
            mobile: user.mobile,
            roles: roleNames,
        };
        const accessToken = this.jwtService.sign(payload);
        return {
            accessToken,
        };
    }
    async register(dto) {
        const { email, password, confirmPassword, firstName, lastName, mobile } = dto;
        if (password !== confirmPassword) {
            throw new common_1.BadRequestException("رمز عبور و تکرار آن یکسان نیستند");
        }
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException("این ایمیل قبلا ثبت شده است");
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const usersCount = await this.prisma.user.count();
        const roleName = usersCount === 0 ? "admin" : "user";
        const user = await this.prisma.user.create({
            data: {
                email,
                passwordHash,
                firstName,
                lastName,
                mobile,
                isActive: true,
            },
        });
        const role = await this.prisma.role.findUnique({
            where: { name: roleName },
        });
        if (!role) {
            throw new common_1.InternalServerErrorException("role پیدا نشد");
        }
        await this.prisma.userRole.create({
            data: {
                userId: user.id,
                roleId: role.id,
            },
        });
        const payload = {
            sub: user.id,
            email: user.email,
            roles: [roleName],
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = (0, crypto_1.randomUUID)();
        await this.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        });
        return {
            accessToken,
        };
    }
    async login(dto) {
        const { email, password } = dto;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user || !user.passwordHash) {
            throw new common_1.UnauthorizedException("ایمیل یا رمز عبور اشتباه است");
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException("حساب کاربری غیرفعال است");
        }
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            throw new common_1.UnauthorizedException("ایمیل یا رمز عبور اشتباه است");
        }
        const roles = await this.prisma.userRole.findMany({
            where: { userId: user.id },
            include: { role: true },
        });
        const roleNames = roles.map((r) => r.role.name);
        const payload = {
            sub: user.id,
            email: user.email,
            roles: roleNames,
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = (0, crypto_1.randomUUID)();
        await this.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        });
        return {
            accessToken,
        };
    }
    async refresh(token) {
        const stored = await this.prisma.refreshToken.findUnique({
            where: { token },
            include: { user: true },
        });
        if (!stored || stored.isRevoked) {
            throw new common_1.UnauthorizedException();
        }
        if (stored.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException();
        }
        await this.prisma.refreshToken.update({
            where: { id: stored.id },
            data: { isRevoked: true },
        });
        const roles = await this.prisma.userRole.findMany({
            where: { userId: stored.user.id },
            include: { role: true },
        });
        const roleNames = roles.map((r) => r.role.name);
        const payload = {
            sub: stored.user.id,
            mobile: stored.user.mobile,
            roles: roleNames,
        };
        const accessToken = this.jwtService.sign(payload);
        const newRefreshToken = (0, crypto_1.randomUUID)();
        await this.prisma.refreshToken.create({
            data: {
                token: newRefreshToken,
                userId: stored.user.id,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        });
        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map