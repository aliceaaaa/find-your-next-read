import { useState } from 'react';
import { getDeviceId, track } from '../lib';

const RATINGS_KEY = 'book_ratings';

const read = (): Record<number, number> => {
  try {
    return JSON.parse(localStorage.getItem(RATINGS_KEY) || '{}');
  } catch {
    return {};
  }
};

/**
 * Reader's own rating for a book (0..10), stored locally and keyed by book id.
 * Tied to the device id so it can be synced to the API once that endpoint
 * exists — for now it lives only in localStorage.
 */
export const useBookRating = (bookId: number) => {
  const [ratings, setRatings] = useState<Record<number, number>>(read);

  const rating = ratings[bookId] ?? null;

  const setRating = (value: number) => {
    const next = { ...ratings, [bookId]: value };
    localStorage.setItem(RATINGS_KEY, JSON.stringify(next));
    setRatings(next);
    track('rate_book', { bookId, rating: value, deviceId: getDeviceId() });
    // TODO: sync to the API (PUT /books/:id/rating) with the device id when ready.
  };

  return { rating, setRating };
};
