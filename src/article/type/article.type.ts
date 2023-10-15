interface IArticleAuthor {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}
export interface IArticleResponse {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: Date;
  updatedAt: Date;
  favorited: boolean;
  favoritesCount: number;
  author: IArticleAuthor;
}
export interface ISingleArticleResponse {
  article: IArticleResponse;
}
export interface IManyArticleResponse {
  articles: IArticleResponse[];
  articlesCount: number;
}
