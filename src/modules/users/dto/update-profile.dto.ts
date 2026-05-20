import {
  IsOptional,
  IsString,
  IsEmail,
  IsDateString,
  Length,
  IsUrl,
  Matches,
  ValidateIf,
} from "class-validator";
import { Trim, Escape } from "class-sanitizer";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Trim()
  @Escape()
  @Length(2, 50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Trim()
  @Escape()
  @Length(2, 50)
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Trim()
  username?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsUrl()
  @ValidateIf((o) => o.githubLink !== "")
  githubLink?: string;

  @IsOptional()
  @IsUrl()
  @ValidateIf((o) => o.linkedInLink !== "")
  linkedInLink?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  jobStatus?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @Trim()
  @Matches(/^09\d{9}$/, {
    message: "mobile must be a valid Iranian phone number (09XXXXXXXXX)",
  })
  mobile?: string;

  @IsOptional()
  @IsString()
  whatIveBeenWorkingOn?: string;
}
