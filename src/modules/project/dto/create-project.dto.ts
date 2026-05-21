import { IsArray, IsOptional, IsString } from "class-validator";
import { Trim, Escape } from "class-sanitizer";

export class CreateProjectLinkDto {
  @IsString()
  @Escape()
  @Trim()
  name: string;

  @IsString()
  @Escape()
  @Trim()
  url: string;
}

export class CreateProjectDto {
  @IsString()
  @Escape()
  @Trim()
  title: string;

  @IsOptional()
  @IsString()
  @Escape()
  @Trim()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  @Escape()
  @Trim()
  longDescription?: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  tools?: string[];

  @IsOptional()
  @IsArray()
  links?: CreateProjectLinkDto[];
}
