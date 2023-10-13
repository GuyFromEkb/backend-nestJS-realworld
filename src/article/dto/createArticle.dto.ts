import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;
  @IsString()
  @IsNotEmpty()
  readonly description: string;
  @IsString()
  @IsNotEmpty()
  readonly body: string;
  @IsArray()
  @IsString({ each: true })
  readonly tagList: string[];
}
