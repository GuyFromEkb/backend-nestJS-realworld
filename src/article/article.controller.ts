import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes } from "@nestjs/common";

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
      articles: articles.map((article) => this.articleService.buildArticleResponse(article)),
      articlesCount,
    };
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new AppValidationPipe())
  async createArticle(
    @Body("article") article: CreateArticleDto,
    @User() user: UserEntity,
  ): Promise<ISingleArticleResponse> {
    const newArticle = await this.articleService.createArticle(article, user);

    return { article: this.articleService.buildArticleResponse(newArticle) };
  }

  @Put("/:slug")
  @UseGuards(AuthGuard)
  @UsePipes(new AppValidationPipe())
  @UsePipes(new ValidatePayloadExistsPipe())
  async updateArticle(
    @Param("slug") slug: string,
    @Body("article") updateArticleDto: UpdateArticleDto,
    @User("id") currentUserId: string,
  ): Promise<ISingleArticleResponse> {
    console.log("updateArticleDto", updateArticleDto);
    const updatedArticle = await this.articleService.updateArticleBySlug(
      slug,
      updateArticleDto,
      currentUserId,
    );
    return { article: this.articleService.buildArticleResponse(updatedArticle) };
  }

  @Get("/:slug")
  async getArticleBySlug(@Param("slug") slug: string): Promise<ISingleArticleResponse> {
    const article = await this.articleService.getArticleBySlug(slug);
    return { article: this.articleService.buildArticleResponse(article) };
  }

  @Delete("/:slug")
  @UseGuards(AuthGuard)
  async deleteArticleBySlug(@Param("slug") slug: string, @User("id") currentUserId: string): Promise<void> {
    await this.articleService.deleteArticleBySlug(slug, currentUserId);
  }
}
