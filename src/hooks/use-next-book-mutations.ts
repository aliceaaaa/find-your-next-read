import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiAttachNextBooks, apiDetachNextBook } from 'api';

export const useAttachNextBooks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, nextBookIds }: { id: number; nextBookIds: number[] }) =>
      apiAttachNextBooks(id, nextBookIds),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['book', id] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useDetachNextBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, nextBookId }: { id: number; nextBookId: number }) =>
      apiDetachNextBook(id, nextBookId),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['book', id] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};
