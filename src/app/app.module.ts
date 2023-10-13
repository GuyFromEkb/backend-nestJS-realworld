import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";

import { ArticleModule } from "~article/article.module";
import { AuthMiddleware } from "~common/middleware";
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
    consumer.apply(AuthMiddleware).exclude("tags", "users/(.*)").forRoutes({
      path: "*",
      method: RequestMethod.ALL,
    });
  }
}
