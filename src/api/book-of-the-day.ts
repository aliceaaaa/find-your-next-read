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
  if (!books.length) {
    return {
      bookOfTheDay: null,
      reviewsOfTheDay: null,
    };
  }

  const now = new Date();
  const daySeed = now.getFullYear() * 1000 + getDayOfYear(now);
  const index = daySeed % books.length;
  const bookOfTheDay = books[index];

  const related = reviews.filter((review) => review.bookId === bookOfTheDay.id);
  const nikReview = related[0];
  const aliceReview = related[1] || related[0];

  return {
    bookOfTheDay,
    reviewsOfTheDay: {
      nik: nikReview
        ? { text: nikReview.text, rating: nikReview.rating }
        : {
            text: `Nik is going to review ${bookOfTheDay.title} soon, so stay tuned!`,
            rating: null,
          },
      alice: aliceReview
        ? { text: aliceReview.text, rating: aliceReview.rating }
        : {
            text: `Alice is going to review ${bookOfTheDay.title} soon, so stay tuned!`,
            rating: null,
          },
    },
  };
};
