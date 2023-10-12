import { Injectable } from "@nestjs/common";
import { decode, sign } from "jsonwebtoken";

import { JWT_ACCESS_SECRET } from "~env";

import { ITokenUserData, TDecodeToken } from "./token.types";

@Injectable()
export class TokenService {
  createToken(userData: ITokenUserData) {
    const { id, email, username } = userData;
    return sign({ id, email, username }, JWT_ACCESS_SECRET);
  }

  decodeToken(token: string): TDecodeToken | null {
    return decode(token, { json: true });
  }
}
