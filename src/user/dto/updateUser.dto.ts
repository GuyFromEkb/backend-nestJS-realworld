import { IsEmail, IsOptional } from "class-validator";

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  readonly email: string;
  @IsOptional()
  readonly password: string;
  @IsOptional()
  readonly username: string;
  @IsOptional()
  readonly bio: string;
  @IsOptional()
  readonly image: string;
}
