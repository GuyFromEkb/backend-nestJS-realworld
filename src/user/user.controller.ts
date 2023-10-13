import { Body, Controller, Get, Post, Put, UseGuards, UsePipes } from "@nestjs/common";
import { AppValidationPipe } from "src/common/error";

import { User } from "~common/decorator/userDecorator/user.decorator";
import { AuthGuard } from "~common/guard";
import { UpdateUserDto } from "~user/dto/updateUser.dto";
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

  @Put("/user")
  @UseGuards(AuthGuard)
  @UsePipes(new AppValidationPipe())
  async updateUser(@Body() body: UpdateUserDto, @User() user: TUser): Promise<IUserRes> {
    console.log("BODY", body);
    return this.userService.buildUserResponse(user);
  }
}
