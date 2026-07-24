export type Book = {
  id: number;
  title: string;
  author: string;
  rating: number;
  reviewCount: number;
  /** Average reader rating (0..10) from the API's rating_avg; null = no ratings yet. */
  ratingAvg?: number | null;
  ratingsCount?: number;
  coverColor: string;
  coverTextColor: string;
  /** Uploaded cover image (URL or data URL). When set, it replaces the
   * generated colour cover. */
  coverImage?: string | null;
  categories: string[];
  description: string;
  published: number;
  pages: number;
  language: string;
  isBookmarked?: boolean;
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
  | 'post-constructor';

export * from './book-of-the-day';
