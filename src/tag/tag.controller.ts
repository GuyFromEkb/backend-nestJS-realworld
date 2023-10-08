import { Controller, Get } from "@nestjs/common";

import { TagService } from "./tag.service";

@Controller("tags")
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async getAllTags(): Promise<{ tags: string[] }> {
    const allTags = await this.tagService.getAllTags();

    return {
      tags: allTags.map((tag) => tag.name),
    };
  }
}
