import { createParamDecorator, ExecutionContext, HttpStatus } from "@nestjs/common";
import { AppHttpException } from "src/common/error";

import { IAppRequest } from "~common/type";

import { TUserField } from "./user.decorator.type";

export const User = createParamDecorator((field: TUserField | undefined, ctx: ExecutionContext) => {
  const request: IAppRequest = ctx.switchToHttp().getRequest();
  if (!request.user) throw new AppHttpException("Unauthorized", HttpStatus.UNAUTHORIZED);

  if (field) return request.user[field];
  return request.user;
});
