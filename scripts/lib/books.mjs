export const SITE_URL = 'https://findyournextread.com';
export const SITE_NAME = 'Find Your Next Read';
export const API_URL =
  process.env.REACT_APP_API_BASE || 'https://api.findyournextread.com/api';

export const fetchAllBooks = async ({ include } = {}) => {
  const books = [];
  let page = 1;
  const includeParam = include ? `&include=${include}` : '';

  while (true) {
    const res = await fetch(
      `${API_URL}/books?page=${page}&per_page=100${includeParam}`,
    );

    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }

    const json = await res.json();

    books.push(...json.data);

    if (json.current_page >= json.last_page) {
      break;
    }

    page++;
  }

  return books;
};

export const bookPath = (book) => `/books/${book.id}/summary/`;
