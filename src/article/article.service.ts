import { HttpStatus, Injectable } from "@nestjs/common";
import slugify from "slugify";
import uniqueSlug from "unique-slug";

import { AppHttpException } from "~common/error";
import { db } from "~db";
import { UserEntity } from "~user/user.entity";

import { ArticleEntity } from "./article.entity";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { IArticleResponse } from "./type/article.type";

@Injectable()
export class ArticleService {
  async createArticle(article: CreateArticleDto, currentUser: UserEntity): Promise<ArticleEntity> {
    const newArticle = new ArticleEntity();

    Object.assign(newArticle, article);
    newArticle.slug = this.generateUniqSlug(newArticle.title, newArticle.id);
    newArticle.author = currentUser;

    return await db.manager.save(ArticleEntity, newArticle);
  }

  async getArticleBySlug(slug: string): Promise<ArticleEntity> {
    const article = await db.manager.findOne(ArticleEntity, {
      where: {
        slug,
      },
      relations: ["author"],
    });

    if (!article) throw new AppHttpException("cant find article by the slug", HttpStatus.NOT_FOUND);

    return article;
  }

  async deleteArticleBySlug(slug: string, currentUserId: string): Promise<void> {
    const article = await db.manager.findOne(ArticleEntity, {
      where: {
        slug,
      },
      relations: ["author"],
    });

    if (!article) throw new AppHttpException("cant find article by the slug", HttpStatus.NOT_FOUND);
    if (article.author.id !== currentUserId)
      throw new AppHttpException("You are not an author", HttpStatus.FORBIDDEN);

    await db.manager.remove(article);
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

  private generateUniqSlug(articleTitle: string, articleUuid: string) {
    const cutArticle = articleTitle.slice(0, 36);
    const slugFromTitle = slugify(cutArticle, {
      lower: true,
      strict: true,
    });
    const uniqHash = uniqueSlug(articleUuid);

    return `${slugFromTitle}-${uniqHash}`;
  }
}
