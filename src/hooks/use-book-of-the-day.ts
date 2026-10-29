import { useQuery } from '@tanstack/react-query';
import { fetchBookOfTheDay } from 'api';
import { UseBookOfTheDayParams } from 'types';

export const useBookOfTheDay = ({
  books: allBooks,
  reviews,
}: UseBookOfTheDayParams) => {
  const dayKey = new Date().toISOString().slice(0, 10);

  return useQuery({
    queryKey: ['book-of-the-day', dayKey, allBooks.length, reviews.length],
    queryFn: () => fetchBookOfTheDay({ books: allBooks, reviews }),
    staleTime: 1000 * 60 * 60,
  });
};
