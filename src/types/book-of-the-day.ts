import type { Book, Review } from './index';

export type ReviewPreview = {
  text: string;
  rating: number | null;
};

export type ReviewsOfTheDay = {
  nik: ReviewPreview;
  alice: ReviewPreview;
};

export type BookOfTheDayPayload = {
  bookOfTheDay: Book | null;
  reviewsOfTheDay: ReviewsOfTheDay | null;
};

export type GetBookOfTheDayParams = {
  books: Book[];
  reviews: Review[];
};

export type UseBookOfTheDayParams = {
  popular: Book[];
  releases: Book[];
  reviews: Review[];
};
