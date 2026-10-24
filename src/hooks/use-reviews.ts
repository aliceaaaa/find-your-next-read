import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchReviewPage, fetchReviews } from 'api';

export const useReviews = () =>
  useQuery({
    queryKey: ['reviews'],
    queryFn: fetchReviews,
    staleTime: 1000 * 60 * 5,
  });

export const useReviewSearch = (author: string) => {
  const trimmed = author.trim();

  return useInfiniteQuery({
    queryKey: ['reviews', 'search', trimmed],
    queryFn: ({ pageParam }) =>
      fetchReviewPage(pageParam, {
        author: trimmed || undefined,
        perPage: 20,
      }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.lastPage ? last.page + 1 : undefined,
    placeholderData: (previous) => previous,
    staleTime: 1000 * 60 * 5,
  });
};
