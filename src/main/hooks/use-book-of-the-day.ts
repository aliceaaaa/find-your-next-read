import { useQuery } from '@tanstack/react-query';
import { fetchBookOfTheDay } from 'api';
import { UseBookOfTheDayParams } from 'types';

export const useBookOfTheDay = ({
  popular,
  releases,
  reviews,
}: UseBookOfTheDayParams) => {
  const allBooks = [...popular, ...releases];
  const dayKey = new Date().toISOString().slice(0, 10);

  return useQuery({
    queryKey: ['book-of-the-day', dayKey, allBooks.length],
    queryFn: () => fetchBookOfTheDay({ books: allBooks, reviews }),
    staleTime: 1000 * 60 * 60,
  });
};
