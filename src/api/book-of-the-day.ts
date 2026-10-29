import {
  BookOfTheDayPayload,
  GetBookOfTheDayParams,
} from 'types/book-of-the-day';

const getDayOfYear = (date: Date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;

  return Math.floor(diff / oneDay);
};

export const fetchBookOfTheDay = async ({
  books,
  reviews,
}: GetBookOfTheDayParams): Promise<BookOfTheDayPayload> => {
  const reviewedIds = new Set(reviews.map((review) => review.bookId));
  const candidates = books.filter((book) => reviewedIds.has(book.id));

  if (!candidates.length) {
    return {
      bookOfTheDay: null,
      reviewsOfTheDay: [],
    };
  }

  const now = new Date();
  const daySeed = now.getFullYear() * 1000 + getDayOfYear(now);
  const index = daySeed % candidates.length;
  const bookOfTheDay = candidates[index];

  return {
    bookOfTheDay,
    reviewsOfTheDay: reviews
      .filter((review) => review.bookId === bookOfTheDay.id)
      .slice(0, 2),
  };
};
