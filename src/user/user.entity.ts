import { hash } from "bcrypt";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { ArticlesEntity } from "~article/articles.entity";

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

  @OneToMany(() => ArticlesEntity, (article) => article.author)
  articles: ArticlesEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, USER_PASSWORD_SALT);
  }
}
