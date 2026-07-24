import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchBooks, searchBooks } from 'api';

export const useBooks = () =>
  useQuery({
    queryKey: ['books'],
    queryFn: () => fetchBooks(),
    staleTime: 1000 * 60 * 5,
  });

export const useBookSearch = (query: string) => {
  const trimmed = query.trim();

  return useInfiniteQuery({
    queryKey: ['books', 'search', trimmed],
    queryFn: ({ pageParam }) => {
      return searchBooks(trimmed, pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (last) => {
      return last.page < last.lastPage ? last.page + 1 : undefined;
    },
    enabled: trimmed.length > 0,
    staleTime: 1000 * 60 * 5,
  });
};
