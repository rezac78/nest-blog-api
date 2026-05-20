import { Escape, Trim } from "class-sanitizer";
import { IsEmail, MinLength } from "class-validator";

export class LoginDto {
  @Trim()
  @Escape()
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
