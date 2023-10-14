import { UserEntity } from "~user/user.entity";

export interface IUserRes {
  user: Omit<UserEntity, "id" | "articles" | "password"> & { token: string };
}
