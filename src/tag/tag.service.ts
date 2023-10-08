import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TagEntity } from "~tag/tag.entity";

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagsRepository: Repository<TagEntity>,
  ) {}

  getAllTags(): Promise<TagEntity[]> {
    return this.tagsRepository.find();
  }
}
