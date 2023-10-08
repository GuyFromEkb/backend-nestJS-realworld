import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  username: "string";

  @Column()
  email: "string";

  @Column()
  password: "string";

  @Column({ default: "" })
  bio: "string";

  @Column({ default: "" })
  image: "string";
}
