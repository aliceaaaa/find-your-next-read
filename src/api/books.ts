import { Book } from 'types';
import { ApiBook, ApiCategory, apiGetBook, apiGetBooks } from './client';

type RichTextNode = {
  type?: string;
  text?: string;
};

type RichTextBlock = {
  content?: RichTextNode[];
};

type RichTextDescription = {
  content?: RichTextBlock[];
};

const createLanguageNames = (): Intl.DisplayNames | null => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'language' });
  } catch {
    return null;
  }
};

const languageNames = createLanguageNames();

export const descriptionToString = (desc: ApiBook['description']): string => {
  if (!desc) {
    return '';
  }

  if (typeof desc === 'string') {
    return desc;
  }

  if ('en' in desc && typeof desc.en === 'string') {
    return desc.en;
  }

  const firstString = Object.values(desc).find(
    (value) => typeof value === 'string',
  );

  if (typeof firstString === 'string') {
    return firstString;
  }

  const content = (desc as RichTextDescription).content;

  if (!Array.isArray(content)) {
    return '';
  }

  const text: string[] = [];

  for (const block of content) {
    for (const node of block.content ?? []) {
      if (node.type === 'text' && typeof node.text === 'string') {
        text.push(node.text);
      }
    }
  }

  return text.join(' ');
};

export const htmlToText = (html: string): string => {
  if (!/<[a-z!/][\s\S]*>/i.test(html)) {
    return html;
  }

  const withBreaks = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6]|blockquote)>/gi, '\n');

  let text: string;

  if (typeof DOMParser !== 'undefined') {
    text =
      new DOMParser().parseFromString(withBreaks, 'text/html').body
        .textContent ?? '';
  } else {
    text = withBreaks
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#0?39;|&apos;/g, "'")
      .replace(/&amp;/g, '&');
  }

  return text
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
};

export const languageToName = (code: string): string => {
  if (!code) {
    return '';
  }

  if (!languageNames) {
    return code;
  }

  try {
    return languageNames.of(code) ?? code;
  } catch {
    return code;
  }
};

export const categoryToName = (category: string | ApiCategory): string =>
  typeof category === 'string' ? category : category.name;

const toRatingAvg = (value: ApiBook['rating_avg']): number | null => {
  if (value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
};

export const mapApiBook = (apiBook: ApiBook): Book => ({
  id: apiBook.id,
  title: apiBook.title,
  author: apiBook.author,
  coverColor: apiBook.cover_color,
  coverTextColor: apiBook.cover_text_color,
  // Prefer the 800px WebP rendition; older covers may not have variants yet.
  coverImage:
    apiBook.cover?.variants?.['800'] ?? apiBook.cover?.url ?? null,
  categories: (apiBook.categories ?? []).map(categoryToName),
  description: htmlToText(descriptionToString(apiBook.description)),
  descriptionHtml: descriptionToString(apiBook.description),
  published: apiBook.published ? new Date(apiBook.published).getFullYear() : 0,
  pages: apiBook.pages ?? 0,
  language: languageToName(apiBook.language ?? ''),
  rating: 0,
  reviewCount: 0,
  ratingAvg: toRatingAvg(apiBook.rating_avg),
  ratingsCount: apiBook.ratings_count ?? 0,
  isBookmarked: false,
  nextBookIds: (apiBook.next_books ?? []).map((next) => next.id),
  createdAt: apiBook.created_at,
});

export const fetchBooks = async (search?: string): Promise<Book[]> => {
  const allBooks: Book[] = [];
  let page = 1;

  while (true) {
    const res = await apiGetBooks(page, { search, include: 'nextBooks' });

    allBooks.push(...res.data.map(mapApiBook));

    if (res.current_page >= res.last_page) {
      break;
    }

    page++;
  }

  return allBooks;
};

export const fetchBook = async (id: number): Promise<Book> => {
  const apiBook = await apiGetBook(id);

  return mapApiBook(apiBook);
};
