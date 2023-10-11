import { Body, Controller, Get, Post, UseGuards, UsePipes } from "@nestjs/common";

import { User } from "~common/decorator/userDecorator/user.decorator";
import { AppValidationPipe } from "~common/errors";
import { AuthGuard } from "~common/guard";
import { IUserRes, TUser } from "~user/type/user.type";

import { CreateUserDto } from "./dto/createUser.dto";
import { LoginUserDto } from "./dto/loginUser.dto";
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
  @Get("/user")
  @UseGuards(AuthGuard)
  async getCurrentUser(@User() user: TUser): Promise<IUserRes> {
    return this.userService.buildUserResponse(user);
  }
}
