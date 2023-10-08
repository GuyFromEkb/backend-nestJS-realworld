import { UserEntity } from "~user/user.entity";

type UserType = Omit<UserEntity, "hashPassword">;

export interface ICreateUserRes {
  user: Omit<UserType, "password"> & { token: string };
}
