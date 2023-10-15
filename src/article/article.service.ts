import { HttpStatus, Injectable } from "@nestjs/common";
import slugify from "slugify";
import uniqueSlug from "unique-slug";

import { AppHttpException } from "~common/error";
import { db } from "~db";
import { UserEntity } from "~user/user.entity";

import { ArticleEntity } from "./article.entity";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { GetAllArticleByQueryDto } from "./dto/getAllArticleByQuery.dto";
import { UpdateArticleDto } from "./dto/updateArticle.dto";
import { IArticleResponse } from "./type/article.type";

@Injectable()
export class ArticleService {
  async getAllByQuery(
    query: GetAllArticleByQueryDto,
    userId: string | null,
  ): Promise<{ articles: ArticleEntity[]; articlesCount: number }> {
    const queryBuilder = db
      .getRepository(ArticleEntity)
      .createQueryBuilder("articles")
      .leftJoinAndSelect("articles.author", "author")
      .offset(query.offset)
      .limit(query.limit)
      .orderBy("articles.createdAt", "DESC");

    if (query.tag) {
      queryBuilder.andWhere("articles.tagList LIKE :tags", { tags: "%" + query.tag + "%" });
    }
    if (query.author) {
      const user = await db.manager.findOneBy(UserEntity, { username: query.author });
      queryBuilder.andWhere("articles.authorId = :id", { id: user?.id });
    }

    const [articles, articlesCount] = await queryBuilder.getManyAndCount();

    return { articles, articlesCount };
  }

  async createArticle(article: CreateArticleDto, currentUser: UserEntity): Promise<ArticleEntity> {
    const newArticle = new ArticleEntity();

    Object.assign(newArticle, article);
    newArticle.slug = this.generateUniqSlug(newArticle.title, newArticle.id);
    newArticle.author = currentUser;

    return await db.manager.save(ArticleEntity, newArticle);
  }

  async updateArticleBySlug(
    slug: string,
    updateArticleDto: UpdateArticleDto,
    currentUserId: string,
  ): Promise<ArticleEntity> {
    const article = await this.getArticleBySlugAndVerifyAuthor(slug, currentUserId);

    Object.assign(article, updateArticleDto);
    return await db.manager.save(ArticleEntity, article);
  }

  async getArticleBySlug(slug: string): Promise<ArticleEntity> {
    return await this.getArticleBySlugAndVerifyAuthor(slug);
  }

  async deleteArticleBySlug(slug: string, currentUserId: string): Promise<void> {
    const article = await this.getArticleBySlugAndVerifyAuthor(slug, currentUserId);

    await db.manager.remove(article);
  }

  async favoriteArticle(slug: string, currentUserId: string): Promise<ArticleEntity> {
    const article = await this.getArticleBySlugAndVerifyAuthor(slug);
    const user = (await db.manager.findOne(UserEntity, {
      where: {
        id: currentUserId,
      },
      relations: ["favorites"],
    }))!;

    const isAlreadyInFavorite = !!user.favorites.find((userArticle) => userArticle.id === article.id);

    if (isAlreadyInFavorite) {
      return article;
    }

    article.favoritesCount++;
    user.favorites.push(article);
    const [, updatedArticle] = await db.manager.save([user, article]);

    return updatedArticle as ArticleEntity;
  }

  buildArticleResponse(article: ArticleEntity): IArticleResponse {
    const { author, slug, title, tagList, favoritesCount, createdAt, updatedAt, description, body } = article;
    return {
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
    };
  }

  private async getArticleBySlugAndVerifyAuthor(
    slug: string,
    currentUserId?: string,
  ): Promise<ArticleEntity> {
    const article = await db.manager.findOne(ArticleEntity, {
      where: {
        slug,
      },
      relations: ["author"],
    });

    if (!article) throw new AppHttpException("cant find article by the slug", HttpStatus.NOT_FOUND);
    if (currentUserId && currentUserId !== article.author.id)
      throw new AppHttpException("You are not an author", HttpStatus.FORBIDDEN);

    return article;
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
