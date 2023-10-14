import { Body, Controller, Delete, Get, Param, Post, UseGuards, UsePipes } from "@nestjs/common";

import { User } from "~common/decorator";
import { AuthGuard } from "~common/guard";
import { AppValidationPipe } from "~common/validator/pipe";
import { UserEntity } from "~user/user.entity";

import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { IArticleResponse } from "./type/article.type";

@Controller("/articles")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new AppValidationPipe())
  async createArticle(
    @Body("article") article: CreateArticleDto,
    @User() user: UserEntity,
  ): Promise<IArticleResponse> {
    const newArticle = await this.articleService.createArticle(article, user);
    return this.articleService.buildArticleResponse(newArticle);
  }

  @Get("/:slug")
  async getArticleBySlug(@Param("slug") slug: string): Promise<IArticleResponse> {
    const article = await this.articleService.getArticleBySlug(slug);
    return this.articleService.buildArticleResponse(article);
  }

  @Delete("/:slug")
  @UseGuards(AuthGuard)
  async deleteArticleBySlug(@Param("slug") slug: string, @User() user: UserEntity): Promise<void> {
    await this.articleService.deleteArticleBySlug(slug, user);
    return;
  }
}
