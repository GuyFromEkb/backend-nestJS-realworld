import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";

import { TokenService } from "~common/service";
import { IAppRequest } from "~common/type";
import { db } from "~db";
import { TUserRelations } from "~user/type/user.type";
import { UserEntity } from "~user/user.entity";

export function createAuthMiddleware(userRelations?: TUserRelations[]) {
  @Injectable()
  class AuthMiddleware implements NestMiddleware {
    constructor(readonly tokenService: TokenService) {}
    async use(req: IAppRequest, _res: Response, next: NextFunction) {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        req.user = null;
        next();
        return;
      }

      const decodeTokenPayload = this.tokenService.decodeToken(token);

      if (!decodeTokenPayload) {
        req.user = null;
        next();
        return;
      }

      req.user = await db.manager.findOne(UserEntity, {
        where: { id: decodeTokenPayload.id },
        relations: userRelations,
      });

      next();
    }
  }

  return AuthMiddleware;
}
