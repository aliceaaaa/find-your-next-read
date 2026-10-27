import { Book, Review } from 'types';
import { orderReleases, sortReleases } from './use-books-stats';

const book = (id: number, createdAt: string, published = 2000) =>
  ({ id, createdAt, published }) as unknown as Book;

const review = (bookId: number, createdAt: string) =>
  ({ bookId, createdAt }) as unknown as Review;

describe('orderReleases', () => {
  const books = [
    book(1, '2026-01-01T00:00:00Z'),
    book(2, '2026-03-01T00:00:00Z'),
    book(3, '2026-02-01T00:00:00Z'),
    book(4, '2026-04-01T00:00:00Z'),
  ];

  it('puts the most recently reviewed books first, by their latest review', () => {
    const reviews = [
      review(1, '2026-05-01T00:00:00Z'),
      review(3, '2026-06-01T00:00:00Z'),
      review(1, '2026-07-01T00:00:00Z'),
    ];

    expect(orderReleases(books, reviews).map((b) => b.id)).toEqual([
      1, 3, 4, 2,
    ]);
  });

  it('orders books without reviews by when they were added', () => {
    expect(orderReleases(books, []).map((b) => b.id)).toEqual([4, 2, 3, 1]);
  });
});

describe('sortReleases', () => {
  const books = [
    book(1, '2026-01-01T00:00:00Z', 1999),
    book(2, '2026-03-01T00:00:00Z', 2021),
    book(3, '2026-02-01T00:00:00Z', 2021),
  ];

  it('sorts by when books were added', () => {
    expect(sortReleases(books, [], 'added').map((b) => b.id)).toEqual([
      2, 3, 1,
    ]);
  });

  it('sorts by year published, newest added first within a year', () => {
    expect(sortReleases(books, [], 'published').map((b) => b.id)).toEqual([
      2, 3, 1,
    ]);
  });
});
