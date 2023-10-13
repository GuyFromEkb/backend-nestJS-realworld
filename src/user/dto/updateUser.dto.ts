import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsString, ValidateNested } from "class-validator";

import { IsOptional } from "~common/validator/dto";

class UserDto {
  @IsOptional()
  @IsEmail()
  @IsNotEmpty()
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
  @IsNotEmpty()
  @IsString()
  readonly bio: string;
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly image: string;
}

export class UpdateUserDto {
  @Type(() => UserDto)
  @ValidateNested()
  @IsNotEmptyObject()
  user: UserDto;
}
