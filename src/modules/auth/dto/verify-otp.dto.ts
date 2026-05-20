import { IsMobilePhone, IsString, Length } from "class-validator";
import { Trim, Escape } from "class-sanitizer";

export class VerifyOtpDto {
  @IsMobilePhone("fa-IR")
  @Trim()
  @Escape()
  mobile: string;

  @IsString()
  @Length(4, 6)
  code: string;
}
