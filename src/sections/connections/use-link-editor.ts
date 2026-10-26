import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Book } from 'types';
import { apiRemoveNextBook, apiSetNextBooks } from 'api';

/** A "read next" link: [book, the book to read after it]. */
export type Link = [number, number];

export type LinkChange = {
  add?: Link;
  remove?: Link;
};

export const applyChange = (books: Book[], { add, remove }: LinkChange) =>
  books.map((book) => {
    let next = book.nextBookIds ?? [];

    if (remove && book.id === remove[0]) {
      next = next.filter((id) => id !== remove[1]);
    }
    if (add && book.id === add[0] && !next.includes(add[1])) {
      next = [...next, add[1]];
    }

    return next === book.nextBookIds ? book : { ...book, nextBookIds: next };
  });

/**
 * Adds, removes or reverses "read next" links. The sky updates right away;
 * if the API refuses, the change is rolled back.
 */
export const useLinkEditor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ add, remove }: LinkChange) => {
      if (remove) {
        await apiRemoveNextBook(remove[0], remove[1]);
      }
      if (add) {
        await apiSetNextBooks(add[0], [add[1]]);
      }
    },
    onMutate: async (change) => {
      await queryClient.cancelQueries({ queryKey: ['books'], exact: true });
      const previous = queryClient.getQueryData<Book[]>(['books']);

      if (previous) {
        queryClient.setQueryData(['books'], applyChange(previous, change));
      }

      return { previous };
    },
    onError: (_error, _change, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['books'], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['books'] }),
  });
};
