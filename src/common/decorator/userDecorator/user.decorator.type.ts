import { UserEntity } from "~user/user.entity";

export type TUserField = keyof Omit<UserEntity, "password">;
