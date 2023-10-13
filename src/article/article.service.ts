import { Injectable } from "@nestjs/common";

import { CreateArticleDto } from "./dto/createArticle.dto";

@Injectable()
export class ArticleService {
  async createArticle(article: CreateArticleDto, currentUserId: string) {
    console.log("article", article, "userId", currentUserId);
    return article;
  }
}
