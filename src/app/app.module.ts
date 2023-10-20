import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";

import { ArticleController } from "~article/article.controller";
import { ArticleModule } from "~article/article.module";
import { createAuthMiddleware } from "~common/middleware";
import { TagModule } from "~tag/tag.module";
import { UserModule } from "~user/user.module";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [TagModule, UserModule, ArticleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(createAuthMiddleware()).exclude("tags", "users/(.*)", "articles").forRoutes({
      path: "*",
      method: RequestMethod.ALL,
    });

    consumer.apply(createAuthMiddleware(["favorites"])).forRoutes(ArticleController);
  }
}
