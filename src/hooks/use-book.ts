import { useQuery } from '@tanstack/react-query';
import { fetchBook } from 'api';

export const useBook = (id: number | null) =>
  useQuery({
    queryKey: ['book', id],
    queryFn: () => fetchBook(id!),
    enabled: id !== null,
    staleTime: 1000 * 60 * 5,
  });
