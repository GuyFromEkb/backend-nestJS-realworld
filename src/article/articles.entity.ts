import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { UserEntity } from "~user/user.entity";

@Entity({ name: "articles" })
export class ArticlesEntity {
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

  @Column({ type: "simple-array" })
  tagList: string[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column()
  favorited: boolean;

  @Column({ default: 0 })
  favoritesCount: number;

  @ManyToOne(() => UserEntity, (user) => user.articles)
  author: UserEntity;

  // actions
  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
