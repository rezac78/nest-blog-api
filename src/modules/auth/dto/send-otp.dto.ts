import { IsMobilePhone } from "class-validator";
import { Trim, Escape } from "class-sanitizer";

export class SendOtpDto {
  @Trim()
  @Escape()
  @IsMobilePhone("fa-IR")
  mobile: string;
}
