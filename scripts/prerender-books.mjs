// Runs after `react-scripts build`. For every book writes
// build/books/{id}/summary/index.html with book-specific <title>, description,
// Open Graph / Twitter tags, canonical, Book JSON-LD and static fallback
// content, plus a 1200×630 PNG preview at build/og/books/{id}.png.
//
// Crawlers that don't execute JS (Telegram, VK, Facebook, Slack, Yandex)
// read these tags directly. The web server must serve $uri/index.html before
// falling back to /index.html.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';
import { SITE_NAME, SITE_URL, bookPath, fetchAllBooks } from './lib/books.mjs';

const BUILD_DIR = new URL('../build/', import.meta.url);
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const DESCRIPTION_LIMIT = 160;

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const decodeEntities = (value) =>
  value
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

// Mirrors descriptionToString in src/api/books.ts, then strips markup.
const descriptionToText = (desc) => {
  let raw = '';

  if (typeof desc === 'string') {
    raw = desc;
  } else if (desc && typeof desc.en === 'string') {
    raw = desc.en;
  } else if (desc) {
    raw =
      Object.values(desc).find((value) => typeof value === 'string') ??
      (desc.content ?? [])
        .flatMap((block) => block.content ?? [])
        .filter((node) => node.type === 'text')
        .map((node) => node.text)
        .join(' ');
  }

  return decodeEntities(raw.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
};

const truncate = (text, limit) => {
  if (text.length <= limit) {
    return text;
  }

  const cut = text.slice(0, limit - 1);

  return `${cut.slice(0, cut.lastIndexOf(' ')) || cut}…`;
};

const wrapText = (text, maxChars, maxLines) => {
  const lines = [];
  let line = '';

  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;

    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) {
    lines.push(line);
  }

  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = truncate(`${kept[maxLines - 1]} …`, maxChars);
    return kept;
  }

  return lines;
};

const renderOgImage = (book) => {
  const coverColor = book.cover_color || '#E63946';
  const coverText = book.cover_text_color || '#FFFFFF';
  const lastName = (book.author ?? '').split(' ').slice(-1)[0] ?? '';

  const coverLines = wrapText(book.title.toUpperCase(), 12, 5);
  const titleLines = wrapText(book.title, 22, 3);
  const titleSize = titleLines.length > 2 ? 54 : 64;

  const tspans = (lines, x, lineHeight) =>
    lines
      .map(
        (line, i) =>
          `<tspan x="${x}" dy="${i === 0 ? 0 : lineHeight}">${escapeHtml(line)}</tspan>`,
      )
      .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}">
  <rect width="100%" height="100%" fill="#F5F5F7"/>
  <rect x="80" y="75" width="340" height="480" rx="16" fill="${escapeHtml(coverColor)}"/>
  <rect x="81" y="76" width="338" height="478" rx="15" fill="none" stroke="#fff" stroke-opacity="0.24" stroke-width="2"/>
  <text x="110" y="125" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="20" font-weight="500" fill="#fff" fill-opacity="0.65" letter-spacing="1">${escapeHtml(lastName.toUpperCase())}</text>
  <text x="110" y="270" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="38" font-weight="900" fill="${escapeHtml(coverText)}">${tspans(coverLines, 110, 42)}</text>
  <text x="110" y="520" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="20" fill="${escapeHtml(coverText)}" fill-opacity="0.7">A Novel</text>
  <text x="490" y="${titleLines.length > 2 ? 190 : 230}" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="${titleSize}" font-weight="700" fill="#1A1A1A">${tspans(titleLines, 490, titleSize + 8)}</text>
  <text x="490" y="${titleLines.length > 2 ? 190 + 3 * (titleSize + 8) + 10 : 230 + titleLines.length * 72 + 10}" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="34" fill="#6B7280">by ${escapeHtml(book.author ?? '')}</text>
  <rect x="490" y="500" width="40" height="56" rx="5" fill="#E63946"/>
  <text x="550" y="540" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="30" font-weight="700" fill="#1A1A1A">${SITE_NAME}</text>
</svg>`;

  return new Resvg(svg, {
    fitTo: { mode: 'width', value: OG_WIDTH },
    font: { loadSystemFonts: true, defaultFontFamily: 'Helvetica Neue' },
  })
    .render()
    .asPng();
};

const bookJsonLd = (book, { url, image, description }) => {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    '@id': `${url}#book`,
    url,
    name: book.title,
    author: { '@type': 'Person', name: book.author },
    image,
    description,
    inLanguage: book.language || undefined,
    numberOfPages: book.pages || undefined,
    datePublished: book.published ? book.published.slice(0, 4) : undefined,
    isbn: book.isbn || undefined,
    genre: (book.categories ?? [])
      .map((c) => (typeof c === 'string' ? c : c.name))
      .filter(Boolean),
  };

  const ratingCount = Number(book.ratings_count) || 0;
  const ratingValue = Number(book.rating_avg);

  if (ratingCount > 0 && Number.isFinite(ratingValue)) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(ratingValue.toFixed(2)),
      ratingCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (!data.genre.length) {
    delete data.genre;
  }

  // "<" in JSON could close the <script> tag early.
  return JSON.stringify(data).replace(/</g, '\\u003c');
};

const replaceOnce = (html, pattern, replacement, label) => {
  if (!pattern.test(html)) {
    throw new Error(`prerender: ${label} not found in build/index.html`);
  }

  return html.replace(pattern, replacement);
};

const renderBookHtml = (template, book) => {
  const url = `${SITE_URL}${bookPath(book)}`;
  const fullText = descriptionToText(book.description);
  const description = truncate(
    fullText || `${book.title} by ${book.author} — on ${SITE_NAME}.`,
    DESCRIPTION_LIMIT,
  );
  const title = `${book.title} by ${book.author} · ${SITE_NAME}`;
  const image = /^https?:\/\//.test(book.cover_image ?? '')
    ? book.cover_image
    : `${SITE_URL}/og/books/${book.id}.png`;
  const hasGeneratedImage = image.startsWith(`${SITE_URL}/og/`);

  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}">`,
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="book">`,
    `<meta property="og:site_name" content="${SITE_NAME}">`,
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    `<meta property="og:description" content="${escapeHtml(description)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${escapeHtml(image)}">`,
    ...(hasGeneratedImage
      ? [
          `<meta property="og:image:width" content="${OG_WIDTH}">`,
          `<meta property="og:image:height" content="${OG_HEIGHT}">`,
        ]
      : []),
    `<meta property="og:image:alt" content="${escapeHtml(`${book.title} by ${book.author}`)}">`,
    `<meta property="book:author" content="${escapeHtml(book.author)}">`,
    ...(book.isbn
      ? [`<meta property="book:isbn" content="${escapeHtml(book.isbn)}">`]
      : []),
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeHtml(title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(description)}">`,
    `<meta name="twitter:image" content="${escapeHtml(image)}">`,
    `<script type="application/ld+json">${bookJsonLd(book, { url, image, description })}</script>`,
  ].join('');

  const fallback = `<div id="root"><header><p><a href="/">${SITE_NAME}</a></p><h1>${escapeHtml(book.title)}</h1><p>by ${escapeHtml(book.author)}</p></header><main><p>${escapeHtml(fullText)}</p></main><nav><a href="/library">Browse all books</a></nav></div>`;

  let html = template;

  html = replaceOnce(html, /<title>[\s\S]*?<\/title>/, '', 'title');
  html = html
    .replace(
      /<meta\s+(?:name|property)="(?:description|og:[\w:]+|twitter:\w+)"[^>]*>/g,
      '',
    )
    .replace(/<link\s+rel="canonical"[^>]*>/g, '');
  html = replaceOnce(html, /<\/head>/, `${tags}</head>`, '</head>');
  html = replaceOnce(
    html,
    /<div id="root">[\s\S]*<\/div>(\s*<\/body>)/,
    `${fallback}$1`,
    '#root',
  );

  return html;
};

const main = async () => {
  const template = await readFile(new URL('index.html', BUILD_DIR), 'utf8');
  const books = (await fetchAllBooks()).filter((book) => !book.deleted_at);

  const ogDir = new URL('og/books/', BUILD_DIR);
  await mkdir(ogDir, { recursive: true });

  for (const book of books) {
    const dir = new URL(`.${bookPath(book)}/`, BUILD_DIR);
    await mkdir(dir, { recursive: true });
    await writeFile(new URL('index.html', dir), renderBookHtml(template, book));

    if (!/^https?:\/\//.test(book.cover_image ?? '')) {
      await writeFile(new URL(`${book.id}.png`, ogDir), renderOgImage(book));
    }
  }

  console.log(`prerendered ${books.length} book pages`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
