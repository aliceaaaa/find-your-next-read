import { useMemo } from 'react';
import { Book, Review } from 'types';
import { useBookOfTheDay } from './use-book-of-the-day';

const POPULAR_COUNT = 5;

const byAdded = (a: Book, b: Book) =>
  (b.createdAt ?? '').localeCompare(a.createdAt ?? '');

export const orderReleases = (books: Book[], reviews: Review[]) => {
  const lastReviewAt = new Map<number, string>();

  reviews.forEach(({ bookId, createdAt = '' }) => {
    if (createdAt > (lastReviewAt.get(bookId) ?? '')) {
      lastReviewAt.set(bookId, createdAt);
    }
  });

  const reviewedAt = (book: Book) => lastReviewAt.get(book.id) ?? '';

  return [...books].sort(
    (a, b) =>
      reviewedAt(b).localeCompare(reviewedAt(a)) || byAdded(a, b),
  );
};

export type ReleaseSort = 'reviewed' | 'added' | 'published';

export const RELEASE_SORTS: { id: ReleaseSort; label: string }[] = [
  { id: 'reviewed', label: 'Latest review' },
  { id: 'added', label: 'Recently added' },
  { id: 'published', label: 'Year published' },
];

export const sortReleases = (
  books: Book[],
  reviews: Review[],
  sort: ReleaseSort,
): Book[] => {
  if (sort === 'reviewed') {
    return orderReleases(books, reviews);
  }
  if (sort === 'added') {
    return [...books].sort(byAdded);
  }

  return [...books].sort((a, b) => b.published - a.published || byAdded(a, b));
};

export const useBooksStats = (
  apiBooks: Book[],
  reviews: Review[],
  bookmarks: Record<number, boolean>,
) => {
  const reviewStats = useMemo(() => {
    const stats = new Map<number, { sum: number; count: number }>();

    reviews.forEach((review) => {
      const entry = stats.get(review.bookId) ?? { sum: 0, count: 0 };
      entry.sum += review.rating;
      entry.count += 1;
      stats.set(review.bookId, entry);
    });

    return stats;
  }, [reviews]);

  const allBooks: Book[] = useMemo(
    () =>
      apiBooks.map((book) => {
        const stats = reviewStats.get(book.id);

        return {
          ...book,
          rating: stats ? Math.round((stats.sum / stats.count) * 10) / 10 : 0,
          reviewCount: stats?.count ?? 0,
          isBookmarked: bookmarks[book.id] ?? false,
        };
      }),
    [apiBooks, reviewStats, bookmarks],
  );

  const releases = useMemo(
    () =>
      Object.fromEntries(
        RELEASE_SORTS.map(({ id }) => [
          id,
          sortReleases(allBooks, reviews, id),
        ]),
      ) as Record<ReleaseSort, Book[]>,
    [allBooks, reviews],
  );

  const popular = useMemo(
    () =>
      [...allBooks]
        .sort(
          (a, b) =>
            b.rating - a.rating ||
            (b.ratingAvg ?? 0) - (a.ratingAvg ?? 0) ||
            b.reviewCount - a.reviewCount,
        )
        .slice(0, POPULAR_COUNT),
    [allBooks],
  );

  const categories = useMemo(
    () => [
      'All',
      ...Array.from(new Set(allBooks.flatMap((b) => b.categories))),
    ],
    [allBooks],
  );

  const favoritesBooks = allBooks.filter((book) => book.isBookmarked);

  const { data: bookOfTheDayData } = useBookOfTheDay({
    books: allBooks,
    reviews,
  });

  return {
    allBooks,
    popular,
    releases,
    categories,
    favoritesBooks,
    bookOfTheDayData,
  };
};
