import { Request } from "express";

import { UserEntity } from "~user/user.entity";

export interface IAppRequest extends Request {
  user: UserEntity | null;
}
