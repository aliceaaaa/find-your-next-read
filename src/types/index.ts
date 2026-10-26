export type Book = {
  id: number;
  title: string;
  author: string;
  rating: number;
  reviewCount: number;
  ratingAvg?: number | null;
  ratingsCount?: number;
  coverColor: string;
  coverTextColor: string;
  coverImage?: string | null;
  categories: string[];
  description: string;
  /** Description markup as written in the editor; may be plain text. */
  descriptionHtml?: string;
  published: number;
  pages: number;
  language: string;
  isBookmarked?: boolean;
  /** Books linked as "read next" after this one, in order. */
  nextBookIds?: number[];
};

export type User = {
  id: number;
  name: string;
  email: string;
  avatar: string;
};

export type PostStatus = 'draft' | 'published';

export type Post = {
  id: number;
  title: string;
  body: string;
  bookId: number | null;
  coverColor: string;
  coverTextColor: string;
  categories: string[];
  status: PostStatus;
  createdAt: string;
};

export type Review = {
  id: number;
  bookId: number;
  authorName: string;
  authorInitials: string;
  rating: number;
  text: string;
  date: string;
};

export type NavItemId =
  | 'home'
  | 'library'
  | 'favorites'
  | 'reviews'
  | 'who-we-are'
  | 'post-constructor';

export * from './book-of-the-day';
