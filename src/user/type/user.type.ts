import { UserEntity } from "~user/user.entity";

export type TUser = Omit<UserEntity, "password" | "hashPassword">;
export interface IUserRes {
  user: Omit<TUser, "id"> & { token: string };
}
