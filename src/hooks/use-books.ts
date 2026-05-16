import { useQuery } from '@tanstack/react-query';
import { fetchBooks } from 'api';

export const useBooks = () =>
  useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
    staleTime: 1000 * 60 * 5,
  });
