import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Book } from 'types';
import { fetchBooks } from 'api';

export const useBooks = () =>
  useQuery({
    queryKey: ['books'],
    queryFn: () => fetchBooks(),
    staleTime: 1000 * 60 * 5,
  });

const matchesQuery = (book: Book, query: string) =>
  [book.title, book.author, ...book.categories].some((field) =>
    field.toLowerCase().includes(query),
  );

// The API ignores filter[search] and returns every book, so search the
// already loaded catalogue instead. This also matches genres, which the
// search bar promises.
export const useBookSearch = (query: string) => {
  const { data: books = [], isPending } = useBooks();
  const trimmed = query.trim().toLowerCase();

  const results = useMemo(
    () => (trimmed ? books.filter((book) => matchesQuery(book, trimmed)) : []),
    [books, trimmed],
  );

  return { results, isLoading: trimmed.length > 0 && isPending };
};
