interface IArticleAuthor {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}
interface IArticle {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: Date;
  updatedAt: Date;
  favorited: boolean;
  favoritesCount: number;
}
export interface IArticleResponse {
  article: IArticle & { author: IArticleAuthor };
}
