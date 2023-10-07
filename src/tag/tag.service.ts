import { Injectable } from "@nestjs/common";

@Injectable()
export class TagService {
  getAllTags(): string[] {
    return [
      "welcome",
      "implementations",
      "introduction",
      "codebaseShow",
      "ipsum",
      "qui",
      "cupiditate",
      "et",
      "quia",
      "deserunt",
    ];
  }
}
