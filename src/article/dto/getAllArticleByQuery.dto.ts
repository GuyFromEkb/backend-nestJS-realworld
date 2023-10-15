import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class GetAllArticleByQueryDto {
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  readonly tag?: string[];

  @IsString()
  @IsOptional()
  readonly author?: string;

  @IsString()
  @IsOptional()
  readonly favorited?: string;

  @IsNumber()
  @IsOptional()
  readonly offset?: number;

  @IsNumber()
  @IsOptional()
  readonly limit?: number;
}
