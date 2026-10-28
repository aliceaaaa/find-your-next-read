import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';
import { SITE_NAME, SITE_URL, bookPath, fetchAllBooks } from './lib/books.mjs';
import { loadStaticPages } from './lib/pages.mjs';

const BUILD_DIR = new URL('../build/', import.meta.url);
const OG_SIZE = 200;
const SITE_OG_IMAGE = 'og-image.png';
const DESCRIPTION_LIMIT = 160;
const TAGLINE = 'Book reviews written entirely by humans';

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

const coverUrl = (book) =>
  /^https?:\/\//.test(book.cover?.url ?? '') ? book.cover.url : null;

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

const fetchCoverDataUri = async (book) => {
  const url = coverUrl(book);

  if (!url) {
    return null;
  }

  try {
    const res = await fetch(url);
    const type = res.headers.get('content-type') ?? '';

    if (!res.ok || !/^image\/(jpeg|png|webp|gif)/.test(type)) {
      return null;
    }

    const data = Buffer.from(await res.arrayBuffer()).toString('base64');

    return `data:${type};base64,${data}`;
  } catch {
    return null;
  }
};

const renderOgImage = (book, coverDataUri) => {
  const coverColor = book.cover_color || '#E63946';
  const coverText = book.cover_text_color || '#FFFFFF';
  const lastName = (book.author ?? '').split(' ').slice(-1)[0] ?? '';
  const cover = { x: 39, y: 14, width: 122, height: 172, radius: 8 };
  const font = 'Helvetica Neue, Helvetica, Arial, sans-serif';

  const tspans = (lines, x, lineHeight) =>
    lines
      .map(
        (line, i) =>
          `<tspan x="${x}" dy="${i === 0 ? 0 : lineHeight}">${escapeHtml(line)}</tspan>`,
      )
      .join('');

  const generatedCover = `
  <rect x="${cover.x}" y="${cover.y}" width="${cover.width}" height="${cover.height}" rx="${cover.radius}" fill="${escapeHtml(coverColor)}"/>
  <text x="${cover.x + 10}" y="${cover.y + 18}" font-family="${font}" font-size="7" font-weight="500" fill="#fff" fill-opacity="0.65" letter-spacing="0.5">${escapeHtml(lastName.toUpperCase())}</text>
  <text x="${cover.x + 10}" y="${cover.y + 64}" font-family="${font}" font-size="13" font-weight="900" fill="${escapeHtml(coverText)}">${tspans(wrapText(book.title.toUpperCase(), 12, 5), cover.x + 10, 15)}</text>
  <text x="${cover.x + 10}" y="${cover.y + cover.height - 10}" font-family="${font}" font-size="7" fill="${escapeHtml(coverText)}" fill-opacity="0.7">A Novel</text>`;

  const uploadedCover = `
  <defs><clipPath id="cover"><rect x="${cover.x}" y="${cover.y}" width="${cover.width}" height="${cover.height}" rx="${cover.radius}"/></clipPath></defs>
  <image href="${coverDataUri}" x="${cover.x}" y="${cover.y}" width="${cover.width}" height="${cover.height}" preserveAspectRatio="xMidYMid slice" clip-path="url(#cover)"/>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${OG_SIZE}" height="${OG_SIZE}" viewBox="0 0 ${OG_SIZE} ${OG_SIZE}">
  <rect width="100%" height="100%" fill="#F5F5F7"/>
  <rect x="${cover.x + 2}" y="${cover.y + 4}" width="${cover.width}" height="${cover.height}" rx="${cover.radius}" fill="#000" fill-opacity="0.08"/>
  ${coverDataUri ? uploadedCover : generatedCover}
</svg>`;

  return new Resvg(svg, {
    fitTo: { mode: 'width', value: OG_SIZE },
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

  return JSON.stringify(data).replace(/</g, '\\u003c');
};

const replaceOnce = (html, pattern, replacement, label) => {
  if (!pattern.test(html)) {
    throw new Error(`prerender: ${label} not found in build/index.html`);
  }

  return html.replace(pattern, replacement);
};

const renderPage = (template, tags, fallback) => {
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

const renderBookHtml = (template, book) => {
  const url = `${SITE_URL}${bookPath(book)}`;
  const fullText = descriptionToText(book.description);
  const description = truncate(
    fullText || `${book.title} by ${book.author} — on ${SITE_NAME}.`,
    DESCRIPTION_LIMIT,
  );
  const title = `${book.title} by ${book.author} · ${SITE_NAME}`;
  const image = `${SITE_URL}/og/books/${book.id}.png`;

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
    `<meta property="og:image:width" content="${OG_SIZE}">`,
    `<meta property="og:image:height" content="${OG_SIZE}">`,
    `<meta property="og:image:alt" content="${escapeHtml(`${book.title} by ${book.author}`)}">`,
    `<meta property="book:author" content="${escapeHtml(book.author)}">`,
    ...(book.isbn
      ? [`<meta property="book:isbn" content="${escapeHtml(book.isbn)}">`]
      : []),
    `<meta name="twitter:card" content="summary">`,
    `<meta name="twitter:title" content="${escapeHtml(title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(description)}">`,
    `<meta name="twitter:image" content="${escapeHtml(image)}">`,
    `<script type="application/ld+json">${bookJsonLd(book, { url, image: coverUrl(book) ?? image, description })}</script>`,
  ].join('');

  const fallback = `<div id="root"><header><p><a href="/">${SITE_NAME}</a> — ${TAGLINE}</p><h1>${escapeHtml(book.title)}</h1><p>by ${escapeHtml(book.author)}</p></header><main><p>${escapeHtml(fullText)}</p></main><nav><a href="/library/">Browse all books</a></nav></div>`;

  return renderPage(template, tags, fallback);
};

const renderStaticPageHtml = (template, page, staticPages, mainHtml = '') => {
  const url = `${SITE_URL}${page.path}`;
  const title = `${page.title} · ${SITE_NAME}`;
  const image = `${SITE_URL}/${SITE_OG_IMAGE}`;

  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(page.description)}">`,
    `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${SITE_NAME}">`,
    `<meta property="og:title" content="${escapeHtml(title)}">`,
    `<meta property="og:description" content="${escapeHtml(page.description)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta property="og:image:width" content="${OG_SIZE}">`,
    `<meta property="og:image:height" content="${OG_SIZE}">`,
    `<meta property="og:image:alt" content="${SITE_NAME} — ${TAGLINE.toLowerCase()}">`,
    `<meta name="twitter:card" content="summary">`,
    `<meta name="twitter:title" content="${escapeHtml(title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(page.description)}">`,
    `<meta name="twitter:image" content="${image}">`,
  ].join('');

  const nav = staticPages
    .map((p) => `<a href="${p.path}">${escapeHtml(p.title)}</a>`)
    .join(' ');
  const fallback = `<div id="root"><header><p><a href="/">${SITE_NAME}</a> — ${TAGLINE}</p><h1>${escapeHtml(page.title)}</h1><p>${escapeHtml(page.description)}</p></header>${mainHtml}<nav>${nav}</nav></div>`;

  return renderPage(template, tags, fallback);
};

const libraryMainHtml = (books) =>
  `<main><ul>${books
    .map(
      (book) =>
        `<li><a href="${bookPath(book)}">${escapeHtml(book.title)}</a> by ${escapeHtml(book.author)}</li>`,
    )
    .join('')}</ul></main>`;

const main = async () => {
  const template = await readFile(new URL('index.html', BUILD_DIR), 'utf8');
  const books = (await fetchAllBooks()).filter((book) => !book.deleted_at);

  const ogDir = new URL('og/books/', BUILD_DIR);
  await mkdir(ogDir, { recursive: true });

  for (const book of books) {
    const dir = new URL(`.${bookPath(book)}`, BUILD_DIR);
    await mkdir(dir, { recursive: true });
    await writeFile(new URL('index.html', dir), renderBookHtml(template, book));

    await writeFile(
      new URL(`${book.id}.png`, ogDir),
      renderOgImage(book, await fetchCoverDataUri(book)),
    );
  }

  const staticPages = await loadStaticPages();

  for (const page of staticPages) {
    const dir = new URL(`.${page.path}`, BUILD_DIR);
    const mainHtml = page.path === '/library/' ? libraryMainHtml(books) : '';
    await mkdir(dir, { recursive: true });
    await writeFile(
      new URL('index.html', dir),
      renderStaticPageHtml(template, page, staticPages, mainHtml),
    );
  }

  console.log(
    `prerendered ${books.length} book pages and ${staticPages.length} static pages`,
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
