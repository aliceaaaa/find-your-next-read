import { Book } from 'types';
import { ApiBook, apiGetBook, apiGetBooks } from './client';

const descriptionToString = (desc: ApiBook['description']): string => {
  if (!desc) return '';
  if (typeof desc === 'string') return desc;
  if (typeof desc === 'object') {
    const record = desc as Record<string, unknown>;
    if (typeof record.en === 'string') return record.en;
    const firstString = Object.values(record).find(
      (v) => typeof v === 'string',
    ) as string | undefined;
    return firstString ?? '';
  }
  return '';
};

const mapNextBook = (apiBook: ApiBook): Book => {
  const base = {
    id: apiBook.id,
    title: apiBook.title,
    author: apiBook.author,
    coverColor: apiBook.cover_color,
    coverTextColor: apiBook.cover_text_color,
    categories: apiBook.categories ?? [],
    description: '',
    published: apiBook.published
      ? new Date(apiBook.published).getFullYear()
      : 0,
    pages: apiBook.pages ?? 0,
    language: apiBook.language ?? '',
    reviews: [],
    rating: 0,
    reviewCount: 0,
    isBookmarked: false,
  };
  return base;
};

export const mapApiBook = (apiBook: ApiBook): Book => ({
  id: apiBook.id,
  title: apiBook.title,
  author: apiBook.author,
  coverColor: apiBook.cover_color,
  coverTextColor: apiBook.cover_text_color,
  categories: apiBook.categories ?? [],
  description: descriptionToString(apiBook.description),
  descriptionRaw:
    apiBook.description && typeof apiBook.description === 'object'
      ? (apiBook.description as Record<string, unknown>)
      : null,
  published: apiBook.published ? new Date(apiBook.published).getFullYear() : 0,
  publishedDate: apiBook.published ?? '',
  pages: apiBook.pages ?? 0,
  language: apiBook.language ?? '',
  isbn: apiBook.isbn ?? '',
  reviews: (apiBook.reviews ?? []).map((review) => ({
    id: review.id,
    author: review.author,
    text: review.text,
    bookId: review.book_id,
    rating: review.rating,
    language: review.language,
    createdAt: new Date(review.created_at),
  })),
  nextBooks: (apiBook.next_books ?? []).map(mapNextBook),
  nextBookIds: (apiBook.next_books ?? []).map((b) => b.id),
  rating: 0,
  reviewCount: 0,
  isBookmarked: false,
});

export const fetchBooks = async (): Promise<Book[]> => {
  const allBooks: Book[] = [];
  let page = 1;

  while (true) {
    const res = await apiGetBooks(page);
    allBooks.push(...res.data.map(mapApiBook));

    if (res.current_page >= res.last_page) break;
    page++;
  }

  return allBooks;
};

export const fetchBook = async (id: number): Promise<Book> => {
  const apiBook = await apiGetBook(id);
  return mapApiBook(apiBook);
};
