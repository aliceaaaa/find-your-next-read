import { writeFile } from 'node:fs/promises';

const SITE_URL = 'https://findyournextread.com';
const API_URL = 'https://api.findyournextread.com/api';

const STATIC_PATHS = [
  '/',
  '/library',
  '/pages/about',
  '/pages/terms',
  '/pages/privacy',
  '/pages/cookies',
];

const fetchAllBooks = async () => {
  const books = [];
  let page = 1;

  while (true) {
    const res = await fetch(`${API_URL}/books?page=${page}&per_page=100`);

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

const toLastmod = (iso) => iso.slice(0, 10);

const urlEntry = (path, lastmod) => {
  const lines = ['  <url>', `    <loc>${SITE_URL}${path}</loc>`];

  if (lastmod) {
    lines.push(`    <lastmod>${lastmod}</lastmod>`);
  }

  lines.push('  </url>');

  return lines.join('\n');
};

const main = async () => {
  const books = await fetchAllBooks();

  const latestUpdate = books.reduce(
    (acc, book) => (book.updated_at > acc ? book.updated_at : acc),
    '',
  );

  const entries = [
    ...STATIC_PATHS.map((path) =>
      urlEntry(path, path === '/' || path === '/library' ? toLastmod(latestUpdate) : undefined),
    ),
    ...books.map((book) =>
      urlEntry(`/books/${book.id}/summary`, toLastmod(book.updated_at)),
    ),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');

  await writeFile(new URL('../public/sitemap.xml', import.meta.url), xml);

  console.log(`sitemap.xml generated: ${STATIC_PATHS.length} static + ${books.length} book URLs`);
};

main();
