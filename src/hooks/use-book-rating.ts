import { useState } from 'react';
import { apiRateBook } from 'api';
import { getDeviceId, track } from '../lib';

const RATINGS_KEY = 'book_ratings';

const read = (): Record<number, number> => {
  try {
    return JSON.parse(localStorage.getItem(RATINGS_KEY) || '{}');
  } catch {
    return {};
  }
};

export const useBookRating = (bookId: number) => {
  const [ratings, setRatings] = useState<Record<number, number>>(read);

  const rating = ratings[bookId] ?? null;

  const setRating = (value: number) => {
    const deviceId = getDeviceId();
    const next = { ...ratings, [bookId]: value };
    localStorage.setItem(RATINGS_KEY, JSON.stringify(next));
    setRatings(next);
    track('rate_book', { bookId, rating: value, deviceId });
    apiRateBook(bookId, value, deviceId).catch(() => {});
  };

  return { rating, setRating };
};
