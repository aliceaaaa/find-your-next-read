export type Book = {
  id: number;
  title: string;
  author: string;
  rating: number;
  reviewCount: number;
  coverColor: string;
  coverTextColor: string;
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
  | 'search'
  | 'library'
  | 'favorites'
  | 'categories'
  | 'reviews'
  | 'profile'
  | 'settings'
  | 'post-constructor';

export * from './book-of-the-day';
