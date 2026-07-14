import { useMemo } from 'react';
import { Book, Review } from 'types';
import { useBookOfTheDay } from './use-book-of-the-day';

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

  const half = Math.ceil(allBooks.length / 2);
  const popular = allBooks.slice(0, half);
  const releases = allBooks.slice(half);

  const categories = useMemo(
    () => [
      'All',
      ...Array.from(new Set(allBooks.flatMap((b) => b.categories))),
    ],
    [allBooks],
  );

  const favoritesBooks = allBooks.filter((book) => book.isBookmarked);

  const { data: bookOfTheDayData } = useBookOfTheDay({
    popular,
    releases,
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
