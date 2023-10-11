import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { compare } from "bcrypt";

import { AppHttpException } from "~common/errors";
import { TokenService } from "~common/service";
import { db } from "~db";

import { CreateUserDto } from "./dto/createUser.dto";
import { LoginUserDto } from "./dto/loginUser.dto";
import { IUserRes } from "./types/user.types";
import { UserEntity } from "./user.entity";

@Injectable()
export class UserService {
  @Inject(TokenService)
  private readonly tokenService: TokenService;
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const isUserExist = !!(await db.manager.findOne(UserEntity, {
      where: [{ username: createUserDto.username }, { email: createUserDto.email }],
    }));

    if (isUserExist) {
      throw new AppHttpException("Email or username are taken", HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const newUser = new UserEntity();
    const mergeUserData = Object.assign(newUser, createUserDto);

    return db.manager.save(UserEntity, mergeUserData);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const existUser = await db.manager.findOne(UserEntity, {
      where: {
        email: loginUserDto.email,
      },
      select: ["email", "password", "bio", "image", "username", "id"],
    });

    if (!existUser) {
      throw new AppHttpException("Email or password has wrong value", HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const isPasswordCorrect = await compare(loginUserDto.password, existUser.password);

    if (!isPasswordCorrect) {
      throw new AppHttpException("Email or password has wrong value", HttpStatus.UNPROCESSABLE_ENTITY);
    }

    return existUser;
  }

  buildUserResponse(userEntity: UserEntity): IUserRes {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, password, ...restUser } = userEntity;

    return {
      user: {
        ...restUser,
        token: this.tokenService.createToken(userEntity),
      },
    };
  }
}
