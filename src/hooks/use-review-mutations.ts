import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ApiReviewPayload,
  apiCreateReview,
  apiDeleteReview,
  apiUpdateReview,
} from 'api';

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ApiReviewPayload) => apiCreateReview(payload),
    onSuccess: (_data, { book_id }) => {
      queryClient.invalidateQueries({ queryKey: ['book', book_id] });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
      bookId,
    }: {
      id: number;
      payload: Partial<ApiReviewPayload>;
      bookId: number;
    }) => apiUpdateReview(id, payload),
    onSuccess: (_data, { bookId }) => {
      queryClient.invalidateQueries({ queryKey: ['book', bookId] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, bookId }: { id: number; bookId: number }) =>
      apiDeleteReview(id),
    onSuccess: (_data, { bookId }) => {
      queryClient.invalidateQueries({ queryKey: ['book', bookId] });
    },
  });
};
