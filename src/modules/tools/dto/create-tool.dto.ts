import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { Trim, Escape } from "class-sanitizer";

export class CreateToolDto {
  @Trim()
  @Escape()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsOptional()
  @IsString()
  image?: string;
}
