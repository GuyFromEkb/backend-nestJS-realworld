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
import { IArticleResponse, IManyArticleResponse, ISingleArticleResponse } from "./type/article.type";

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
    @User() user: UserEntity | null,
  ): Promise<IManyArticleResponse> {
    const { articles, articlesCount } = await this.articleService.getAllByQuery(query);

    const articlesRes: IArticleResponse[] = articles.map((articleEntity) =>
      this.articleService.buildArticleResponse(articleEntity, user),
    );

    return {
      articles: articlesRes,
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
      article: this.articleService.buildArticleResponse(article),
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
    const article = await this.articleService.updateArticleBySlug(slug, updateArticleDto, currentUser.id);

    return {
      article: this.articleService.buildArticleResponse(article, currentUser),
    };
  }

  @Get("/:slug")
  async getArticleBySlug(
    @Param("slug") slug: string,
    @User() currentUser: UserEntity | null,
  ): Promise<ISingleArticleResponse> {
    const article = await this.articleService.getArticleBySlug(slug);

    return {
      article: this.articleService.buildArticleResponse(article, currentUser),
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
    @User() currentUser: UserEntity,
  ): Promise<ISingleArticleResponse> {
    const { article, currentUser: updatedUserFavorite } = await this.articleService.favoriteArticle(
      slug,
      currentUser,
    );

    return {
      article: this.articleService.buildArticleResponse(article, updatedUserFavorite),
    };
  }

  @Delete("/:slug/favorite")
  @UseGuards(AuthGuard)
  async unFavoriteArticle(
    @Param("slug") slug: string,
    @User() currentUser: UserEntity,
  ): Promise<ISingleArticleResponse> {
    const { article, currentUser: updatedUserFavorite } = await this.articleService.unFavoriteArticle(
      slug,
      currentUser,
    );

    return {
      article: this.articleService.buildArticleResponse(article, updatedUserFavorite),
    };
  }
}
