import { UserEntity } from "~user/user.entity";

export interface IUserResponse {
  user: Pick<UserEntity, "bio" | "image" | "username" | "email"> & { token: string };
}
