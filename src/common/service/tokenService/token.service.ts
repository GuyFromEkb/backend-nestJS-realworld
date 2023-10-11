import { Injectable } from "@nestjs/common";
import { sign } from "jsonwebtoken";

import { JWT_ACCESS_SECRET } from "~env";

import { ITokenUserData } from "./token.types";

@Injectable()
export class TokenService {
  createToken(userData: ITokenUserData) {
    const { id, email, username } = userData;
    return sign({ id, email, username }, JWT_ACCESS_SECRET);
  }
}
