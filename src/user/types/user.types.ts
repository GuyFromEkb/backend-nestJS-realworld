import { UserEntity } from "~user/user.entity";

export interface IUserRes {
  user: Omit<UserEntity, "password" | "id" | "hashPassword"> & { token: string };
}
