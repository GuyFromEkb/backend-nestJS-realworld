import { HttpStatus, Injectable } from "@nestjs/common";
import jwt from "jsonwebtoken";

import { AppHttpException } from "~common/errors";
import { db } from "~db";
import { JWT_ACCESS_SECRET } from "~env";
import { UserEntity } from "~user/user.entity";

import { CreateUserDto } from "./dto/createUser.dto";

@Injectable()
export class UserService {
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

  createToken(createUserDto: CreateUserDto) {
    return jwt.sign(createUserDto, JWT_ACCESS_SECRET);
  }
}
