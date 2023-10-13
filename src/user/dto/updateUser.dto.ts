import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsString, ValidateNested } from "class-validator";

import { IsOptional } from "~common/validator/dto";

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  readonly email: string;
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly password: string;
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly username: string;
  @IsOptional()
  @IsString()
  readonly bio: string;
  @IsOptional()
  @IsString()
  readonly image: string;
}

export class UpdateUserDtoReqBody {
  @Type(() => UpdateUserDto)
  @ValidateNested()
  @IsNotEmptyObject()
  user: UpdateUserDto;
}
