import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from "@nestjs/common";

import { UpdateArticleDto } from "~article/dto/updateArticle.dto";
import { User } from "~common/decorator";
import { AuthGuard } from "~common/guard";
import { AppValidationPipe, ValidatePayloadExistsPipe } from "~common/validator/pipe";
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

  @Put("/:slug")
  @UseGuards(AuthGuard)
  @UsePipes(new AppValidationPipe())
  @UsePipes(new ValidatePayloadExistsPipe())
  async updateArticle(
    @Param("slug") slug: string,
    @Body("article") updateArticleDto: UpdateArticleDto,
    @User("id") currentUserId: string,
  ) {
    console.log("updateArticleDto", updateArticleDto);
    const updatedArticle = await this.articleService.updateArticleBySlug(
      slug,
      updateArticleDto,
      currentUserId,
    );
    return this.articleService.buildArticleResponse(updatedArticle);
  }

  @Get("/:slug")
  async getArticleBySlug(@Param("slug") slug: string): Promise<IArticleResponse> {
    const article = await this.articleService.getArticleBySlug(slug);
    return this.articleService.buildArticleResponse(article);
  }

  @Delete("/:slug")
  @UseGuards(AuthGuard)
  async deleteArticleBySlug(@Param("slug") slug: string, @User("id") currentUserId: string): Promise<void> {
    await this.articleService.deleteArticleBySlug(slug, currentUserId);
  }
}
