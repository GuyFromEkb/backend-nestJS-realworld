import { Injectable } from "@nestjs/common";
import slugify from "slugify";
import uniqueSlug from "unique-slug";

import { db } from "~db";
import { UserEntity } from "~user/user.entity";

import { ArticleEntity } from "./article.entity";
import { CreateArticleDto } from "./dto/createArticle.dto";

@Injectable()
export class ArticleService {
  async createArticle(article: CreateArticleDto, currentUser: UserEntity) {
    const newArticle = new ArticleEntity();

    Object.assign(newArticle, article);
    newArticle.slug = this.generateUniqSlug(newArticle.title, newArticle.id);
    newArticle.author = currentUser as UserEntity;

    return await db.manager.save(ArticleEntity, newArticle);
  }

  private generateUniqSlug(articleTitle: string, articleUuid: string) {
    const slugFromTitle = slugify(articleTitle, {
      lower: true,
      strict: true,
    });
    const uniqHash = uniqueSlug(articleUuid);

    return `${slugFromTitle}-${uniqHash}`;
  }
}
