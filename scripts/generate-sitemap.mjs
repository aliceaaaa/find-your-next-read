import { writeFile } from 'node:fs/promises';
import { SITE_URL, bookPath, fetchAllBooks } from './lib/books.mjs';
import { loadStaticPages } from './lib/pages.mjs';

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
  const staticPaths = [
    '/',
    ...(await loadStaticPages()).map((page) => page.path),
  ];

  const latestUpdate = books.reduce(
    (acc, book) => (book.updated_at > acc ? book.updated_at : acc),
    '',
  );

  const entries = [
    ...staticPaths.map((path) =>
      urlEntry(
        path,
        path === '/' || path === '/library/'
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
    `sitemap.xml generated: ${staticPaths.length} static + ${books.length} book URLs`,
  );
};

main();
