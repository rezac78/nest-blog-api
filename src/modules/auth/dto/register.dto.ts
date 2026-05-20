import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  MinLength,
} from "class-validator";
import { Trim, Escape } from "class-sanitizer";

export class RegisterDto {
  @Trim()
  @Escape()
  @IsNotEmpty()
  firstName: string;

  @Trim()
  @Escape()
  @IsNotEmpty()
  lastName: string;

  @Trim()
  @Escape()
  @IsEmail()
  email: string;

  @Trim()
  @Escape()
  @IsMobilePhone("fa-IR")
  mobile: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  confirmPassword: string;
}
