import { useMemo } from 'react';
import { Book, Review } from 'types';
import { useBookOfTheDay } from './use-book-of-the-day';

const POPULAR_COUNT = 5;

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

  // Newest first; the shelf shows as many as fit in one row.
  const releases = useMemo(
    () => [...allBooks].sort((a, b) => b.published - a.published),
    [allBooks],
  );

  // Top rated by review score (what the card shows); visitor ratings and
  // review count break ties so unrated books don't win by list order.
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
