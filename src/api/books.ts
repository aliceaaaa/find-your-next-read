import { Book } from 'types';
import { ApiBook, apiGetBook, apiGetBooks } from './client';

const descriptionToString = (desc: ApiBook['description']): string => {
  if (!desc) return '';
  if (typeof desc === 'string') return desc;

  const localized =
    (desc as Record<string, unknown>).en ??
    Object.values(desc).find((value) => typeof value === 'string');

  if (typeof localized === 'string') return localized;

  const content = (desc as any)?.content;

  if (Array.isArray(content)) {
    return content
      .flatMap((block: any) => block?.content ?? [])
      .filter((node: any) => node?.type === 'text')
      .map((node: any) => node.text)
      .join(' ');
  }

  return '';
};

const languageToName = (code: string): string => {
  if (!code) return '';

  try {
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(code) ?? code;
  } catch {
    return code;
  }
};

export const mapApiBook = (apiBook: ApiBook): Book => ({
  id: apiBook.id,
  title: apiBook.title,
  author: apiBook.author,
  coverColor: apiBook.cover_color,
  coverTextColor: apiBook.cover_text_color,
  categories: apiBook.categories ?? [],
  description: descriptionToString(apiBook.description),
  published: apiBook.published ? new Date(apiBook.published).getFullYear() : 0,
  pages: apiBook.pages ?? 0,
  language: languageToName(apiBook.language ?? ''),
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
