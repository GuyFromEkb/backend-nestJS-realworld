import { hash } from "bcrypt";
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

//Todo при абсолютном пути (алиасах) не работают скрипты (работа с orm через package.json)
import { ArticleEntity } from "../article/article.entity";
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

  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];

  @ManyToMany(() => ArticleEntity)
  @JoinTable()
  favorites: ArticleEntity[];

  @BeforeInsert()
  private async hashPassword() {
    this.password = await hash(this.password, USER_PASSWORD_SALT);
  }
}
