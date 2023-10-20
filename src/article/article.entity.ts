import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

//Todo при абсолютном пути не работает при работе с orm через package.json
import { UserEntity } from "../user/user.entity";

@Entity({ name: "articles" })
export class ArticleEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @Column({ type: "simple-array", default: "" })
  tagList: string[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ default: 0 })
  favoritesCount: number;

  @ManyToOne(
    () => UserEntity,
    (user) => user.articles,
    // С Этой опцией, мы всегда будем получать вместе с сущьностю, ещё связанную сущьность (автора), без надобности указывать relations: ["author"],
    { eager: true },
  )
  author: UserEntity;

  // actions
  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
