import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { PrismaService } from "database/prisma/prisma.service";
import { randomUUID } from "crypto";

import { generateOtp } from "./utils/generate-otp";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async sendOtp(mobile: string) {
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
        throw new HttpException(
          "لطفاً یک دقیقه بعد دوباره تلاش کنید",
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }

    const { otp, codeHash } = await generateOtp();

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

  async verifyOtp(mobile: string, code: string) {
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
      throw new BadRequestException("کد نامعتبر است یا منقضی شده است");
    }

    if (otp.attempts >= 5) {
      throw new BadRequestException(
        "تعداد تلاش بیش از حد مجاز است. لطفاً دوباره کد دریافت کنید",
      );
    }

    if (otp.expiresAt < new Date()) {
      throw new BadRequestException("کد منقضی شده است");
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

      throw new BadRequestException("کد نامعتبر است یا منقضی شده است");
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
        throw new InternalServerErrorException("نقش کاربر در سیستم پیدا نشد");
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

  async register(dto: RegisterDto) {
    const { email, password, confirmPassword, firstName, lastName, mobile } =
      dto;

    if (password !== confirmPassword) {
      throw new BadRequestException("رمز عبور و تکرار آن یکسان نیستند");
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException("این ایمیل قبلا ثبت شده است");
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
      throw new InternalServerErrorException("role پیدا نشد");
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

    const refreshToken = randomUUID();

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

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException("ایمیل یا رمز عبور اشتباه است");
    }

    if (!user.isActive) {
      throw new UnauthorizedException("حساب کاربری غیرفعال است");
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedException("ایمیل یا رمز عبور اشتباه است");
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

    const refreshToken = randomUUID();

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken,
      // refreshToken,
    };
  }

  async refresh(token: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
    if (!stored || stored.isRevoked) {
      throw new UnauthorizedException();
    }
    if (stored.expiresAt < new Date()) {
      throw new UnauthorizedException();
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

    const newRefreshToken = randomUUID();
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
}
