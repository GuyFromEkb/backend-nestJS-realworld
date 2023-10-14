import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateArticleDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  readonly body: string;
}
