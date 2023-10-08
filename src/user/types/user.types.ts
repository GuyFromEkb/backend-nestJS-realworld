import { UserEntity } from "~user/user.entity";

type UserType = UserEntity;

export interface ICreateUserRes {
  user: UserType & { token: string };
}
