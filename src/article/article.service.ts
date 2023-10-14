import { Injectable } from "@nestjs/common";
import slugify from "slugify";
import uniqueSlug from "unique-slug";

import { db } from "~db";
import { UserEntity } from "~user/user.entity";

import { ArticleEntity } from "./article.entity";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { IArticleResponse } from "./type/article.type";

@Injectable()
export class ArticleService {
  async createArticle(article: CreateArticleDto, currentUser: UserEntity) {
    const newArticle = new ArticleEntity();

    Object.assign(newArticle, article);
    newArticle.slug = this.generateUniqSlug(newArticle.title, newArticle.id);
    newArticle.author = currentUser;

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

  buildArticleResponse(article: ArticleEntity): IArticleResponse {
    const { author, slug, title, tagList, favoritesCount, createdAt, updatedAt, description, body } = article;
    return {
      article: {
        slug,
        title,
        description,
        body,
        createdAt,
        updatedAt,
        tagList,
        favoritesCount,
        //TODO убрать хардкод
        favorited: false,
        author: {
          bio: author.bio,
          image: author.image,
          username: author.username,
          //TODO убрать хардкод
          following: false,
        },
      },
    };
  }
}
