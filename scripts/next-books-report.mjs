import { SITE_URL, API_URL, bookPath, fetchAllBooks } from './lib/books.mjs';

const args = process.argv.slice(2);

const numFlag = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  const value = index !== -1 ? Number(args[index + 1]) : NaN;
  return Number.isFinite(value) ? value : fallback;
};

const MAX_IN = numFlag('max-in', 1);
const MAX_OUT = numFlag('max-out', 1);

const paint = process.stdout.isTTY && !process.env.NO_COLOR;
const wrap =
  (code) =>
  (text) =>
    (paint ? `\x1b[${code}m${text}\x1b[0m` : text);

const bold = wrap('1');
const dim = wrap('2');
const red = wrap('31');
const green = wrap('32');
const yellow = wrap('33');
const cyan = wrap('36');
const gray = wrap('90');

const buildStats = (books) => {
  const outgoing = new Map();
  const incoming = new Map();
  let links = 0;
  let selfLoops = 0;
  const duplicates = [];

  for (const book of books) {
    const next = book.next_books ?? [];
    outgoing.set(book.id, next.length);
    links += next.length;

    const seen = new Set();
    for (const target of next) {
      if (target.id === book.id) selfLoops += 1;

      const edge = `${book.id}->${target.id}`;
      if (seen.has(edge)) duplicates.push(edge);
      seen.add(edge);

      incoming.set(target.id, (incoming.get(target.id) ?? 0) + 1);
    }
  }

  const knownIds = new Set(books.map((book) => book.id));
  const dangling = [...incoming.keys()].filter((id) => !knownIds.has(id));

  return {
    links,
    selfLoops,
    duplicates,
    dangling,
    inOf: (id) => incoming.get(id) ?? 0,
    outOf: (id) => outgoing.get(id) ?? 0,
  };
};

const truncate = (text, width) =>
  text.length > width ? `${text.slice(0, Math.max(1, width - 1))}…` : text;

const pad = (text, width, alignStart = false) => {
  const value = truncate(text, width);
  return alignStart ? value.padStart(width) : value.padEnd(width);
};

const RULE = '─'.repeat(64);

const section = (title) => {
  console.log(`\n  ${bold(cyan(title))}`);
  console.log(`  ${gray('─'.repeat(44))}`);
};

const stat = (label, value) => {
  const dots = '·'.repeat(Math.max(2, 32 - label.length));
  console.log(`  ${label} ${gray(dots)} ${value}`);
};

const renderTable = (books, stats) => {
  const width = Math.min(process.stdout.columns ?? 100, 120);
  const gaps = 2 * 5;

  const idW = Math.max(2, ...books.map((b) => String(b.id).length));
  const pathW = Math.max(4, ...books.map((b) => bookPath(b).length));
  const inW = 2;
  const outW = 3;

  const rest = Math.max(
    28,
    width - idW - pathW - inW - outW - gaps - 4,
  );
  const titleW = Math.max(12, Math.floor(rest * 0.55));
  const authorW = Math.max(10, rest - titleW);

  const num = (n, w) => (n === 0 ? gray(pad(String(n), w, true)) : cyan(pad(String(n), w, true)));

  console.log(
    `  ${[
      dim(pad('ID', idW, true)),
      dim(pad('НАЗВАНИЕ', titleW)),
      dim(pad('АВТОР', authorW)),
      dim(pad('ВХ', inW, true)),
      dim(pad('ИСХ', outW, true)),
      dim(pad('ССЫЛКА', pathW)),
    ].join('  ')}`,
  );
  console.log(`  ${gray('─'.repeat(idW + titleW + authorW + inW + outW + pathW + gaps))}`);

  for (const book of books) {
    const inN = stats.inOf(book.id);
    const outN = stats.outOf(book.id);
    const isolated = inN === 0 && outN === 0;

    const cells = [
      isolated
        ? yellow(pad(String(book.id), idW, true))
        : bold(pad(String(book.id), idW, true)),
      isolated ? yellow(pad(book.title, titleW)) : pad(book.title, titleW),
      dim(pad(book.author, authorW)),
      num(inN, inW),
      num(outN, outW),
      gray(pad(bookPath(book), pathW)),
    ];

    console.log(`  ${cells.join('  ')}`);
  }
};

const renderDistribution = (books, stats) => {
  const distribution = new Map();

  for (const book of books) {
    const key = `${stats.inOf(book.id)} вх / ${stats.outOf(book.id)} исх`;
    distribution.set(key, (distribution.get(key) ?? 0) + 1);
  }

  const sorted = [...distribution.entries()].sort(
    ([a], [b]) =>
      Number(a.split(' ')[0]) - Number(b.split(' ')[0]) ||
      Number(a.split(' ')[3]) - Number(b.split(' ')[3]),
  );

  const maxCount = Math.max(...sorted.map(([, count]) => count));

  for (const [key, count] of sorted) {
    const bar = green('█'.repeat(count));
    const barVoid = gray('░'.repeat(Math.max(0, maxCount - count)));
    stat(key, `${String(count).padStart(3)} ${bar}${barVoid}`);
  }
};

const main = async () => {
  const books = await fetchAllBooks({ include: 'nextBooks' });

  if (books.length === 0) {
    console.log(yellow('API вернул 0 книг — нечего анализировать.'));
    return;
  }

  const stats = buildStats(books);

  const lowConnectivity = books
    .filter(
      (book) => stats.inOf(book.id) <= MAX_IN && stats.outOf(book.id) <= MAX_OUT,
    )
    .sort((a, b) => a.id - b.id);

  const isolated = books.filter(
    (book) => stats.inOf(book.id) === 0 && stats.outOf(book.id) === 0,
  );

  console.log(gray(RULE));
  console.log(`  ${bold('NEXT BOOKS')} ${dim('·')} ${dim('отчёт по связям книг')} ${dim('·')} ${gray(new Date().toISOString().slice(0, 10))}`);
  console.log(`  ${gray(`источник: ${API_URL}/books?include=nextBooks`)}`);
  console.log(gray(RULE));

  section('1. Общая статистика');
  stat('Книг в базе', bold(books.length));
  stat('Всего связей nextBooks', bold(green(stats.links)));

  const issues = [
    ['Дубликаты связей', stats.duplicates.length, stats.duplicates],
    ['Петли (книга → сама себя)', stats.selfLoops, null],
    ['Висящие цели (нет книги)', stats.dangling.length, stats.dangling],
  ];

  let clean = true;
  for (const [label, count, detail] of issues) {
    if (count > 0) {
      clean = false;
      const extra = detail ? ` ${gray(detail.slice(0, 5).join(', '))}` : '';
      stat(label, red(`${count}${extra}`));
    }
  }
  if (clean) {
    stat('Целостность', green('ок — дублей, петель и висящих целей нет'));
  }

  section(`2. Книги с ≤${MAX_IN} вх. и ≤${MAX_OUT} исх. (${lowConnectivity.length} из ${books.length})`);
  renderTable(lowConnectivity, stats);

  if (isolated.length > 0) {
    console.log(
      `\n  ${yellow('⚑')} из них полностью изолированных (0 вх / 0 исх): ${yellow(bold(isolated.length))} — подсвечены жёлтым`,
    );
  }

  console.log(
    `  ${dim(`ссылка на книгу: ${SITE_URL}/books/<ID>/summary/`)}`,
  );

  section('3. Распределение связей по всем книгам');
  renderDistribution(books, stats);

  console.log(gray(RULE));
  console.log('');
};

main().catch((error) => {
  console.error(red(`✖ Ошибка: ${error.message}`));
  process.exit(1);
});
