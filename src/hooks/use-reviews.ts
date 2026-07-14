import { useQuery } from '@tanstack/react-query';
import { fetchReviews } from 'api';

export const useReviews = () =>
  useQuery({
    queryKey: ['reviews'],
    queryFn: fetchReviews,
    staleTime: 1000 * 60 * 5,
  });
