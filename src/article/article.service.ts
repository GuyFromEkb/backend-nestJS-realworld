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
    currentUserId: string | null,
  ): Promise<{ articles: IArticleResponse[]; articlesCount: number }> {
    const queryBuilder = db
      .getRepository(ArticleEntity)
      .createQueryBuilder("articles")
      .leftJoinAndSelect("articles.author", "author")
      .offset(query.offset)
      .limit(query.limit)
      .orderBy("articles.createdAt", "DESC");

    if (query.tag) {
      // Select where string is in simple-array
      // queryBuilder.andWhere("articles.tagList LIKE :tags", { tags: "%" + query.tag + "%" });
      queryBuilder.andWhere("articles.tagList IN (:...tags)", { tags: query.tag });
    }

    if (query.author) {
      const user = await db.manager.findOneBy(UserEntity, { username: query.author });
      queryBuilder.andWhere("articles.authorId = :id", { id: user?.id });
    }
    //Тут поле назвали по уебански, если шо query.favorited === Имя пользователя.Статьи которые данный пользователь лайкнул
    if (query.favorited) {
      const userWithFavorited = await db.manager.findOne(UserEntity, {
        where: {
          username: query.favorited,
        },
        relations: ["favorites"],
      });

      if (userWithFavorited && userWithFavorited.favorites.length) {
        const favoriteIds = userWithFavorited!.favorites.map(
          (userFavoritedArticle) => userFavoritedArticle.id,
        );

        queryBuilder.andWhere("articles.id IN (:...favoriteIds)", {
          favoriteIds,
        });
      } else {
        //самый простой и быстрый способ выйти из queryBuilder (С)Oleksandr
        queryBuilder.andWhere("1=0");
      }
    }

    const currentUserWithFavoritesPromise = currentUserId
      ? db.manager.findOne(UserEntity, {
          where: {
            id: currentUserId,
          },
          relations: ["favorites"],
        })
      : null;
    const articlesAndCountPromise = queryBuilder.getManyAndCount();

    const [currentUserWithFavorites, articlesAndCount] = await Promise.all([
      currentUserWithFavoritesPromise,
      articlesAndCountPromise,
    ]);
    const [articlesFromDb, articlesCount] = articlesAndCount;

    const articles: IArticleResponse[] = articlesFromDb.map((article) => ({
      ...article,
      favorited: !!currentUserWithFavorites?.favorites.some(
        (userFavoriteArticle) => userFavoriteArticle.id === article.id,
      ),
      author: {
        ...article.author,
        //Todo убрать хардкод
        following: false,
      },
    }));

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

  async favoriteArticle(
    slug: string,
    currentUserId: string,
  ): Promise<{ article: ArticleEntity; user: UserEntity }> {
    const { article, user } = await this.getArticleBySlugAndCurrentUserWithFavorites(slug, currentUserId);

    const favoriteInUserIdx = user.favorites.findIndex((userArticle) => userArticle.id === article.id);
    const userAlreadyHasFavoriteInThisArticle = favoriteInUserIdx !== -1;

    if (userAlreadyHasFavoriteInThisArticle) {
      return { article, user };
    }

    article.favoritesCount++;
    user.favorites.push(article);
    const [updatedUser, updatedArticle] = await db.manager.save([user, article]);

    return { article: updatedArticle as ArticleEntity, user: updatedUser as UserEntity };
  }

  async unFavoriteArticle(
    slug: string,
    currentUserId: string,
  ): Promise<{ article: ArticleEntity; user: UserEntity }> {
    const { article, user } = await this.getArticleBySlugAndCurrentUserWithFavorites(slug, currentUserId);

    const favoriteInUserIdx = user.favorites.findIndex((userArticle) => userArticle.id === article.id);
    const userHasNotThisArticleInFavorite = favoriteInUserIdx === -1;

    if (userHasNotThisArticleInFavorite) {
      return { article, user };
    }

    article.favoritesCount--;
    user.favorites.splice(favoriteInUserIdx, 1);

    const [updatedUser, updatedArticle] = await db.manager.save([user, article]);
    return { article: updatedArticle as ArticleEntity, user: updatedUser as UserEntity };
  }

  buildArticleResponse(options: {
    article: ArticleEntity;
    isFavoritedArticle: boolean;
    isFollowingAuthor: boolean;
  }): IArticleResponse {
    const { article, isFavoritedArticle, isFollowingAuthor } = options;
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
      favorited: isFavoritedArticle,
      author: {
        bio: author.bio,
        image: author.image,
        username: author.username,
        //TODO убрать хардкод
        following: isFollowingAuthor,
      },
    };
  }

  async articleHasFavorited(article: ArticleEntity, currentUser: UserEntity) {
    if (currentUser.favorites) {
      return currentUser.favorites.some((userArticleFavorites) => userArticleFavorites.id === article.id);
    }

    const userWithFavorites = (await db.manager.findOne(UserEntity, {
      where: {
        id: currentUser.id,
      },
      relations: ["favorites"],
    }))!;

    return userWithFavorites.favorites.some((userArticleFavorites) => userArticleFavorites.id === article.id);
  }

  private async getArticleBySlugAndCurrentUserWithFavorites(
    slug: string,
    currentUserId: string,
  ): Promise<{ article: ArticleEntity; user: UserEntity }> {
    const article = await this.getArticleBySlugAndVerifyAuthor(slug);
    const user = (await db.manager.findOne(UserEntity, {
      where: {
        id: currentUserId,
      },
      relations: ["favorites"],
    }))!;

    return { article, user };
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
