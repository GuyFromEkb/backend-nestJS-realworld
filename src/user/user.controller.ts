import { Body, Controller, Post, UsePipes } from "@nestjs/common";

import { AppValidationPipe } from "~common/errors";

import { CreateUserDto } from "./dto/createUser.dto";
import { LoginUserDto } from "./dto/loginUser.dto";
import { IUserRes } from "./types/user.types";
import { UserService } from "./user.service";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/users")
  @UsePipes(new AppValidationPipe())
  async createUser(@Body("user") createUserDto: CreateUserDto): Promise<IUserRes> {
    const newUser = await this.userService.createUser(createUserDto);

    return this.userService.buildUserResponse(newUser);
  }

  @Post("/users/login")
  @UsePipes(new AppValidationPipe())
  async loginUser(@Body("user") loginUserDto: LoginUserDto): Promise<IUserRes> {
    const user = await this.userService.loginUser(loginUserDto);

    return this.userService.buildUserResponse(user);
  }
}
