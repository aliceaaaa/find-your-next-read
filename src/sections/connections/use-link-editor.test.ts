import { Book } from 'types';
import { applyChange } from './use-link-editor';

const book = (id: number, nextBookIds: number[] = []) =>
  ({ id, nextBookIds }) as unknown as Book;

const links = (books: Book[]) =>
  Object.fromEntries(books.map((b) => [b.id, b.nextBookIds]));

describe('applyChange', () => {
  const books = [book(1, [2]), book(2), book(3)];

  it('adds a link', () => {
    expect(links(applyChange(books, { add: [2, 3] }))).toEqual({
      1: [2],
      2: [3],
      3: [],
    });
  });

  it('removes a link', () => {
    expect(links(applyChange(books, { remove: [1, 2] }))).toEqual({
      1: [],
      2: [],
      3: [],
    });
  });

  it('reverses a link', () => {
    expect(
      links(applyChange(books, { remove: [1, 2], add: [2, 1] })),
    ).toEqual({ 1: [], 2: [1], 3: [] });
  });

  it('does not add the same link twice', () => {
    expect(links(applyChange(books, { add: [1, 2] }))).toEqual({
      1: [2],
      2: [],
      3: [],
    });
  });
});
