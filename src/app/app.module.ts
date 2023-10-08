import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ormConfig } from "~config/ormConfig";
import { TagModule } from "~tag/tag.module";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [TypeOrmModule.forRoot(ormConfig), TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
