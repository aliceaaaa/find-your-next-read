import type { Book, Review } from './index';

export type BookOfTheDayPayload = {
  bookOfTheDay: Book | null;
  reviewsOfTheDay: Review[];
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
