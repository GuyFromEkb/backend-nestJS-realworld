import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";

import { TokenService } from "~common/service";
import { IAppRequest } from "~common/type";
import { db } from "~db";
import { UserEntity } from "~user/user.entity";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}
  async use(req: IAppRequest, _res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      req.user = null;
      next();
      return;
    }

    try {
      const decodeToken = this.tokenService.decodeToken(token);
      req.user = await db.manager.findOne(UserEntity, { where: { id: decodeToken?.id } });
    } catch (err) {
      req.user = null;
    } finally {
      next();
    }
  }
}
