import { Module } from "@nestjs/common";

import { TokenService } from "~common/service";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  controllers: [UserController],
  providers: [UserService, TokenService],
})
export class UserModule {}
