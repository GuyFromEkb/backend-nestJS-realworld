import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";

import { CreateUserDto } from "./dto/createUser.dto";
import { ICreateUserRes } from "./types/user.types";
import { UserService } from "./user.service";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/users")
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto): Promise<ICreateUserRes> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithOutPassword } = await this.userService.createUser(createUserDto);

    return {
      user: {
        ...userWithOutPassword,
        token: this.userService.createToken(createUserDto),
      },
    };
  }
}
