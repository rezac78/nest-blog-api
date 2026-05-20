import {
  IsOptional,
  IsString,
  IsEmail,
  IsBoolean,
  IsDateString,
  Length,
} from "class-validator";
import { Trim, Escape } from "class-sanitizer";

export class UpdateUserDto {
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
  @Trim()
  @Escape()
  email?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  @Length(10, 10)
  nationalCode?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
