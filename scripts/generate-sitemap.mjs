import { writeFile } from 'node:fs/promises';
import { SITE_URL, bookPath, fetchAllBooks } from './lib/books.mjs';

const STATIC_PATHS = [
  '/',
  '/library',
  '/pages/about',
  '/pages/terms',
  '/pages/privacy',
  '/pages/cookies',
];

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
      urlEntry(
        path,
        path === '/' || path === '/library'
          ? toLastmod(latestUpdate)
          : undefined,
      ),
    ),
    ...books.map((book) =>
      urlEntry(bookPath(book), toLastmod(book.updated_at)),
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

  console.log(
    `sitemap.xml generated: ${STATIC_PATHS.length} static + ${books.length} book URLs`,
  );
};

main();
