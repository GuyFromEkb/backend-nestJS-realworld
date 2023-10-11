import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Response } from "express";
import { decode } from "jsonwebtoken";

import { IAppRequest } from "~common/type";
import { db } from "~db";
import { UserEntity } from "~user/user.entity";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: IAppRequest, _res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("AuthMiddleware");
    if (!token) {
      req.user = null;
      next();
      return;
    }

    try {
      const decodeToken = decode(token!, { json: true });
      req.user = await db.manager.findOne(UserEntity, { where: { id: decodeToken!.id } });
    } catch (err) {
      req.user = null;
    } finally {
      next();
    }
  }
}
