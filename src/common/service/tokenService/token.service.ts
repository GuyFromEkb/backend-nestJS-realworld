import { Injectable } from "@nestjs/common";
import { decode, sign, verify } from "jsonwebtoken";

import { JWT_ACCESS_SECRET } from "~env";

import { ITokenUserData, TDecodeToken } from "./token.types";

@Injectable()
export class TokenService {
  createToken(userData: ITokenUserData) {
    const { id, email, username } = userData;
    return sign({ id, email, username }, JWT_ACCESS_SECRET);
  }

  decodeToken(token: string): TDecodeToken | null {
    try {
      const tokenPayload = verify(token, JWT_ACCESS_SECRET);
      return tokenPayload as TDecodeToken;
    } catch {
      return null;
    }
  }
}
