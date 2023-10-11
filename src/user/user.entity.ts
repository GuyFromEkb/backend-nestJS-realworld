import { hash } from "bcrypt";
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

//Todo при абсолютном пути не работает при работе с orm через package.json
import { USER_PASSWORD_SALT } from "../env";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: "" })
  bio: string;

  @Column({ default: "" })
  image: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, USER_PASSWORD_SALT);
  }
}
