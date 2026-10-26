import { Book } from 'types';

const MARGIN = 56;
const COLUMN_GAP = 160;
const ROW_GAP = 170;
// How far a star keeps from a line that is not its own.
const CLEARANCE = 44;
// Name labels: 10px mono with wide letter spacing, and a length cap.
const LABEL_CHAR_WIDTH = 7.8;
export const LABEL_MAX_CHARS = 32;
const CONSTELLATION_GAP = 130;
const LONE_CELL_WIDTH = 190;
const LONE_ROW_GAP = 120;
const MIN_HEIGHT = 520;
export const UNCHARTED = 'Uncharted';
export const STAR_LABEL_MAX_CHARS = 18;

export type Star = {
  book: Book;
  x: number;
  y: number;
  r: number;
  /** Index into `Sky.constellations`, or null for a star without links. */
  constellation: number | null;
  /** Seconds, so the stars don't all twinkle in step. */
  twinkleDelay: number;
};

export type Constellation = {
  /** The genre most of its books share. */
  name: string;
  /** Indexes into `Sky.stars`. */
  stars: number[];
  /** "Read next" links as [from, to] indexes into `Sky.stars`. */
  links: [number, number][];
  labelX: number;
  labelY: number;
};

export type Sky = {
  width: number;
  height: number;
  stars: Star[];
  constellations: Constellation[];
  /** Where the band of stars without links starts, if there are any. */
  loneTop: number | null;
  /** Background specks, purely decorative. */
  dust: { x: number; y: number; r: number }[];
};

type Point = { x: number; y: number };

const hash = (text: string) => {
  let h = 2166136261;

  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }

  return h >>> 0;
};

// Seeded, so the sky keeps its shape between visits.
const makeRandom = (seed: number) => {
  let a = seed;

  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** The point of segment a–b closest to p. */
const closestOnSegment = (p: Point, a: Point, b: Point): Point => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSquared = dx * dx + dy * dy || 1;
  const t = Math.max(
    0,
    Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSquared),
  );

  return { x: a.x + t * dx, y: a.y + t * dy };
};

const starRadius = (book: Book) => (book.reviewCount > 0 ? 4.6 : 3.4);

/** Groups of books joined by "read next" links, in either direction. */
const findGroups = (books: Book[]) => {
  const byId = new Map(books.map((book) => [book.id, book]));
  const neighbours = new Map<number, Set<number>>(
    books.map((book) => [book.id, new Set<number>()]),
  );

  books.forEach((book) => {
    (book.nextBookIds ?? []).forEach((nextId) => {
      if (byId.has(nextId) && nextId !== book.id) {
        neighbours.get(book.id)?.add(nextId);
        neighbours.get(nextId)?.add(book.id);
      }
    });
  });

  const seen = new Set<number>();
  const groups: Book[][] = [];

  books.forEach((book) => {
    if (seen.has(book.id)) {
      return;
    }

    const group: Book[] = [];
    const queue = [book.id];
    seen.add(book.id);

    while (queue.length) {
      const id = queue.shift() as number;
      group.push(byId.get(id) as Book);

      neighbours.get(id)?.forEach((next) => {
        if (!seen.has(next)) {
          seen.add(next);
          queue.push(next);
        }
      });
    }

    groups.push(group);
  });

  return groups;
};

/**
 * Lays one group out in reading order: each book one column
 * after the furthest book that leads to it. Returns positions around (0, 0).
 */
const shapeGroup = (
  group: Book[],
  random: () => number,
  vertical: boolean,
) => {
  const ids = new Set(group.map((book) => book.id));
  const depth = new Map(group.map((book) => [book.id, 0]));

  // Longest path from a start; capped so a cycle cannot loop forever.
  for (let round = 0; round < group.length; round++) {
    let changed = false;

    group.forEach((book) => {
      (book.nextBookIds ?? []).forEach((nextId) => {
        const next = (depth.get(book.id) ?? 0) + 1;

        if (ids.has(nextId) && next > (depth.get(nextId) ?? 0)) {
          depth.set(nextId, next);
          changed = true;
        }
      });
    });

    if (!changed) {
      break;
    }
  }

  const columns = new Map<number, Book[]>();
  group.forEach((book) => {
    const column = depth.get(book.id) ?? 0;
    columns.set(column, [...(columns.get(column) ?? []), book]);
  });

  // Work in reading-order space: x along the order, y across it.
  const points = new Map<number, Point>();
  const sortedColumns = Array.from(columns.keys()).sort((a, b) => a - b);

  sortedColumns.forEach((column) => {
    const books = columns.get(column) as Book[];

    // Put each book level with the books that lead to it, which keeps
    // the lines from crossing.
    const parentLevel = (book: Book) => {
      const levels = group
        .filter((p) => p.nextBookIds?.includes(book.id) && points.has(p.id))
        .map((p) => (points.get(p.id) as Point).y);

      return levels.length
        ? levels.reduce((sum, y) => sum + y, 0) / levels.length
        : 0;
    };

    if (column > 0) {
      books.sort((a, b) => parentLevel(a) - parentLevel(b));
    }

    books.forEach((book, row) => {
      points.set(book.id, {
        x: column * COLUMN_GAP + (random() - 0.5) * COLUMN_GAP * 0.3,
        y:
          (row - (books.length - 1) / 2) * ROW_GAP +
          (random() - 0.5) * ROW_GAP * 0.3,
      });
    });
  });

  // Nudge a star off any line that is not its own, so a path never seems
  // to run through a book it does not lead to.
  const edges = group.flatMap((book) =>
    (book.nextBookIds ?? [])
      .filter((nextId) => ids.has(nextId))
      .map((nextId) => [book.id, nextId]),
  );

  for (let pass = 0; pass < 8; pass++) {
    let moved = false;

    edges.forEach(([from, to]) => {
      group.forEach((book) => {
        if (book.id === from || book.id === to) {
          return;
        }

        const p = points.get(book.id) as Point;
        const q = closestOnSegment(
          p,
          points.get(from) as Point,
          points.get(to) as Point,
        );
        const gap = Math.hypot(p.x - q.x, p.y - q.y);

        if (gap < CLEARANCE) {
          const side = p.y >= q.y ? 1 : -1;
          points.set(book.id, { ...p, y: p.y + side * (CLEARANCE - gap + 6) });
          moved = true;
        }
      });
    });

    if (!moved) {
      break;
    }
  }

  // Narrow screens read the order top to bottom instead.
  if (vertical) {
    points.forEach((p, id) => points.set(id, { x: p.y * 0.9, y: p.x * 0.8 }));
  }

  // A slight tilt keeps the chains from looking like a table.
  const angle = (random() - 0.5) * 0.3;
  const all = Array.from(points.values());
  const cx = all.reduce((sum, p) => sum + p.x, 0) / all.length;
  const cy = all.reduce((sum, p) => sum + p.y, 0) / all.length;

  points.forEach((p, id) => {
    const dx = p.x - cx;
    const dy = p.y - cy;
    points.set(id, {
      x: dx * Math.cos(angle) - dy * Math.sin(angle),
      y: dx * Math.sin(angle) + dy * Math.cos(angle),
    });
  });

  return points;
};

const dominantGenre = (group: Book[]) => {
  const counts = new Map<string, number>();

  group.forEach((book) =>
    book.categories.forEach((name) =>
      counts.set(name, (counts.get(name) ?? 0) + 1),
    ),
  );

  const [best] = Array.from(counts.entries()).sort(
    ([nameA, a], [nameB, b]) => b - a || nameA.localeCompare(nameB),
  );

  return best ? best[0] : UNCHARTED;
};

const bounds = (points: Point[]) => ({
  minX: Math.min(...points.map((p) => p.x)),
  maxX: Math.max(...points.map((p) => p.x)),
  minY: Math.min(...points.map((p) => p.y)),
  maxY: Math.max(...points.map((p) => p.y)),
});

/**
 * One sky for the whole catalogue. Books joined by "read next" links form
 * constellations, biggest first, packed in rows; books without links sit
 * apart below them as lone stars.
 */
export const buildSky = (books: Book[], width: number): Sky => {
  const random = makeRandom(hash(books.map((b) => b.id).join(',')));
  const margin = width < 600 ? MARGIN * 0.8 : MARGIN;
  const groups = findGroups(books);
  const linked = groups
    .filter((group) => group.length > 1)
    .sort((a, b) => b.length - a.length);
  const lone = groups.filter((group) => group.length === 1).flat();

  const stars: Star[] = [];
  const constellations: Constellation[] = [];
  const indexById = new Map<number, number>();

  // Shelf packing: fill a row left to right, then start the next one.
  let cursorX = margin;
  let cursorY = margin;
  let rowHeight = 0;
  // Constellation indexes per row, with where each one ends on the right.
  const rows: { index: number; right: number }[][] = [[]];

  linked.forEach((group) => {
    const points = shapeGroup(group, random, width < 600);
    const name = dominantGenre(group);
    const maxWidth = width - margin * 2;
    const raw = bounds(Array.from(points.values()));

    // Squeeze a chain that is wider than a narrow screen.
    if (raw.maxX - raw.minX > maxWidth) {
      const scale = maxWidth / (raw.maxX - raw.minX);
      points.forEach((p, id) => points.set(id, { ...p, x: p.x * scale }));
    }

    const box = bounds(Array.from(points.values()));
    const labelWidth =
      (Math.min(name.length, LABEL_MAX_CHARS) + 2) * LABEL_CHAR_WIDTH;
    const boxWidth = Math.min(
      maxWidth,
      Math.max(box.maxX - box.minX, labelWidth),
    );
    // Room for the star labels and the name below.
    const boxHeight = box.maxY - box.minY + 64;

    if (cursorX > margin && cursorX + boxWidth > width - margin) {
      cursorX = margin;
      cursorY += rowHeight + CONSTELLATION_GAP;
      rowHeight = 0;
      rows.push([]);
    }

    const offsetX = cursorX - box.minX;
    const offsetY = cursorY - box.minY + random() * 24;
    const index = constellations.length;
    const memberIndexes: number[] = [];

    group.forEach((book) => {
      const p = points.get(book.id) as Point;
      indexById.set(book.id, stars.length);
      memberIndexes.push(stars.length);
      stars.push({
        book,
        x: p.x + offsetX,
        y: p.y + offsetY,
        r: starRadius(book),
        constellation: index,
        twinkleDelay: random() * 4,
      });
    });

    constellations.push({
      name,
      stars: memberIndexes,
      links: [],
      labelX: box.minX + offsetX,
      labelY: box.maxY + offsetY + 52,
    });

    rows[rows.length - 1].push({ index, right: cursorX + boxWidth });
    cursorX += boxWidth + CONSTELLATION_GAP;
    rowHeight = Math.max(rowHeight, boxHeight + 24);
  });

  // Spread each row over the full width, with a little wobble so the rows
  // don't look ruled.
  rows.forEach((row) => {
    if (!row.length) {
      return;
    }

    const extra = width - margin - row[row.length - 1].right;

    row.forEach(({ index }, k) => {
      const shift = Math.min(
        extra,
        Math.max(
          0,
          (extra * (k + 1)) / (row.length + 1) + (random() - 0.5) * 30,
        ),
      );
      const constellation = constellations[index];

      constellation.labelX += shift;
      constellation.stars.forEach((i) => {
        stars[i].x += shift;
      });
    });
  });

  constellations.forEach((constellation) => {
    constellation.stars.forEach((from) => {
      (stars[from].book.nextBookIds ?? []).forEach((nextId) => {
        const to = indexById.get(nextId);

        if (to !== undefined) {
          constellation.links.push([from, to]);
        }
      });
    });
  });

  // Books without links get a band of their own at the bottom, so they
  // don't look attached to a constellation.
  const loneTop = lone.length
    ? linked.length
      ? cursorY + rowHeight + CONSTELLATION_GAP / 2
      : margin
    : null;
  const columnsPerRow = Math.max(
    2,
    Math.floor((width - margin * 2) / LONE_CELL_WIDTH),
  );
  const cellWidth = (width - margin * 2) / columnsPerRow;

  lone.forEach((book, i) => {
    const column = i % columnsPerRow;
    const row = Math.floor(i / columnsPerRow);

    stars.push({
      book,
      x: margin + cellWidth * (column + 0.5) + (random() - 0.5) * cellWidth * 0.4,
      y: (loneTop as number) + 70 + row * LONE_ROW_GAP + (random() - 0.5) * 36,
      r: starRadius(book),
      constellation: null,
      twinkleDelay: random() * 4,
    });
  });

  const height = Math.max(
    MIN_HEIGHT,
    loneTop === null
      ? cursorY + rowHeight + margin
      : loneTop +
          70 +
          (Math.ceil(lone.length / columnsPerRow) - 1) * LONE_ROW_GAP +
          margin +
          30,
  );

  const dust = Array.from(
    { length: Math.round((width * height) / 2600) },
    () => ({
      x: random() * width,
      y: random() * height,
      r: 0.3 + random() * 0.9,
    }),
  );

  return { width, height, stars, constellations, loneTop, dust };
};
