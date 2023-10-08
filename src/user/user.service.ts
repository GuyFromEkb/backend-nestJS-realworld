import { Injectable } from "@nestjs/common";
import jwt from "jsonwebtoken";

import { db } from "~db";
import { JWT_ACCESS_SECRET } from "~env";
import { UserEntity } from "~user/user.entity";

import { CreateUserDto } from "./dto/createUser.dto";

@Injectable()
export class UserService {
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = new UserEntity();
    const mergeUserData = Object.assign(newUser, createUserDto);

    return db.manager.save(UserEntity, mergeUserData);
  }

  createToken(createUserDto: CreateUserDto) {
    return jwt.sign(createUserDto, JWT_ACCESS_SECRET);
  }
}
