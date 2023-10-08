import { Injectable } from "@nestjs/common";

import postgresDataSource from "~config/ormConfig";
import { TagEntity } from "~tag/tag.entity";

@Injectable()
export class TagService {
  getAllTags(): Promise<TagEntity[]> {
    return postgresDataSource.manager.find(TagEntity);
  }
}
