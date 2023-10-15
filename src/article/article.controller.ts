import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from "@nestjs/common";

import { User } from "~common/decorator";
import { AuthGuard } from "~common/guard";
import { AppValidationPipe, ValidatePayloadExistsPipe } from "~common/validator/pipe";
import { UserEntity } from "~user/user.entity";

import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { GetAllArticleByQueryDto } from "./dto/getAllArticleByQuery.dto";
import { UpdateArticleDto } from "./dto/updateArticle.dto";
import { IManyArticleResponse, ISingleArticleResponse } from "./type/article.type";

@Controller("/articles")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async getAllByQuery(
    @Query(
      new AppValidationPipe({
        transform: true,
        //Строки приводим к типу, указаным в Dto
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    query: GetAllArticleByQueryDto,
    @User("id") userId: string | null,
  ): Promise<IManyArticleResponse> {
    const { articles, articlesCount } = await this.articleService.getAllByQuery(query, userId);
    return {
      articles: articles.map((article) =>
        this.articleService.buildArticleResponse({
          article,
          isFavoritedArticle: false,
          isFollowingAuthor: false,
        }),
      ),
      articlesCount,
    };
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new AppValidationPipe())
  async createArticle(
    @Body("article") createArticleDto: CreateArticleDto,
    @User() user: UserEntity,
  ): Promise<ISingleArticleResponse> {
    const article = await this.articleService.createArticle(createArticleDto, user);

    return {
      article: this.articleService.buildArticleResponse({
        article,
        isFavoritedArticle: false,
        isFollowingAuthor: false,
      }),
    };
  }

  @Put("/:slug")
  @UseGuards(AuthGuard)
  @UsePipes(new AppValidationPipe())
  @UsePipes(new ValidatePayloadExistsPipe())
  async updateArticle(
    @Param("slug") slug: string,
    @Body("article") updateArticleDto: UpdateArticleDto,
    @User() currentUser: UserEntity,
  ): Promise<ISingleArticleResponse> {
    console.log("updateArticleDto", updateArticleDto);
    const article = await this.articleService.updateArticleBySlug(slug, updateArticleDto, currentUser.id);
    const isFavorited = await this.articleService.articleHasFavorited(article, currentUser);
    return {
      article: this.articleService.buildArticleResponse({
        article,
        isFavoritedArticle: isFavorited,
        isFollowingAuthor: false,
      }),
    };
  }

  @Get("/:slug")
  async getArticleBySlug(
    @Param("slug") slug: string,
    @User() currentUser?: UserEntity,
  ): Promise<ISingleArticleResponse> {
    const article = await this.articleService.getArticleBySlug(slug);
    if (!currentUser)
      return {
        article: this.articleService.buildArticleResponse({
          article,
          isFavoritedArticle: false,
          isFollowingAuthor: false,
        }),
      };

    const isFavorited = await this.articleService.articleHasFavorited(article, currentUser);
    return {
      article: this.articleService.buildArticleResponse({
        article,
        isFavoritedArticle: isFavorited,
        isFollowingAuthor: false,
      }),
    };
  }

  @Delete("/:slug")
  @UseGuards(AuthGuard)
  async deleteArticleBySlug(@Param("slug") slug: string, @User("id") currentUserId: string): Promise<void> {
    await this.articleService.deleteArticleBySlug(slug, currentUserId);
  }

  @Post("/:slug/favorite")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async favoriteArticle(
    @Param("slug") slug: string,
    @User("id") currentUserId: string,
  ): Promise<ISingleArticleResponse> {
    const { article, user } = await this.articleService.favoriteArticle(slug, currentUserId);
    const isFavorited = await this.articleService.articleHasFavorited(article, user);
    return {
      article: this.articleService.buildArticleResponse({
        article,
        isFavoritedArticle: isFavorited,
        isFollowingAuthor: false,
      }),
    };
  }

  @Delete("/:slug/favorite")
  @UseGuards(AuthGuard)
  async unFavoriteArticle(
    @Param("slug") slug: string,
    @User("id") currentUserId: string,
  ): Promise<ISingleArticleResponse> {
    const { article, user } = await this.articleService.unFavoriteArticle(slug, currentUserId);
    const isFavorited = await this.articleService.articleHasFavorited(article, user);
    return {
      article: this.articleService.buildArticleResponse({
        article,
        isFavoritedArticle: isFavorited,
        isFollowingAuthor: false,
      }),
    };
  }
}
