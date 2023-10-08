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

    Object.assign(newUser, createUserDto);
    console.log("newUser", newUser);

    return db.manager.save(UserEntity, newUser);
  }

  createToken(createUserDto: CreateUserDto) {
    return jwt.sign(createUserDto, JWT_ACCESS_SECRET);
  }
}
