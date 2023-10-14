import { Body, Controller, Post, UseGuards, UsePipes } from "@nestjs/common";

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
    console.log("article", article);
    const newArticle = await this.articleService.createArticle(article, user);
    return this.articleService.buildArticleResponse(newArticle);
  }
}
