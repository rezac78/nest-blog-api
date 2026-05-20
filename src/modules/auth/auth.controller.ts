import { Body, Controller, Post } from "@nestjs/common";
import { SendOtpDto } from "./dto/send-otp.dto";
import { AuthService } from "./auth.service";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { Throttle } from "@nestjs/throttler";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Throttle({ default: { limit: 3, ttl: 60 } })
  @Post("send-otp")
  sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto.mobile);
  }
  @Post("verify-otp")
  @Throttle({ default: { limit: 5, ttl: 120 } })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.mobile, dto.code);
  }
  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post("refresh")
  refresh(@Body("refreshToken") token: string) {
    return this.authService.refresh(token);
  }
}
