import { Injectable } from "@nestjs/common";

import { db } from "~db";
import { TagEntity } from "~tag/tag.entity";

@Injectable()
export class TagService {
  getAllTags(): Promise<TagEntity[]> {
    return db.manager.find(TagEntity);
  }
}
