import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import { IAppRequest } from "~common/type";

import { TUserField } from "./user.decorator.type";

export const User = createParamDecorator((field: TUserField | undefined, ctx: ExecutionContext) => {
  const request: IAppRequest = ctx.switchToHttp().getRequest();

  if (request.user && field) return request.user[field];
  return request.user;
});
