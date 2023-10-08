import { Body, Controller, Post } from "@nestjs/common";

import { CreateUserDto } from "./dto/createUser.dto";
import { ICreateUserRes } from "./types/user.types";
import { UserService } from "./user.service";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/users")
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ICreateUserRes> {
    const userEntity = await this.userService.createUser(createUserDto);

    return {
      user: {
        ...userEntity,
        token: this.userService.createToken(createUserDto),
      },
    };
  }
}
