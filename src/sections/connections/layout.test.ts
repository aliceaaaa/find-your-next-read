import { Book } from 'types';
import { UNCHARTED, buildSky } from './layout';

const book = (
  id: number,
  nextBookIds: number[] = [],
  categories: string[] = [],
) =>
  ({
    id,
    title: `Book ${id}`,
    author: 'Author',
    categories,
    nextBookIds,
    reviewCount: 0,
  }) as unknown as Book;

const titles = (sky: ReturnType<typeof buildSky>, indexes: number[]) =>
  indexes.map((i) => sky.stars[i].book.id).sort();

describe('buildSky', () => {
  const books = [
    book(1, [2], ['Sci-Fi', 'Classics']),
    book(2, [3], ['Sci-Fi']),
    book(3, [], ['Classics', 'Sci-Fi']),
    book(4, [5]),
    book(5),
    book(6),
    book(7, [99]),
  ];

  it('joins books only through read-next links, biggest group first', () => {
    const sky = buildSky(books, 1000);

    expect(sky.constellations.map((c) => titles(sky, c.stars))).toEqual([
      [1, 2, 3],
      [4, 5],
    ]);
  });

  it('keeps the direction of each link', () => {
    const sky = buildSky(books, 1000);
    const links = sky.constellations[0].links.map(([from, to]) => [
      sky.stars[from].book.id,
      sky.stars[to].book.id,
    ]);

    expect(links).toEqual([
      [1, 2],
      [2, 3],
    ]);
  });

  it('names a constellation after its most common genre', () => {
    const sky = buildSky(books, 1000);

    expect(sky.constellations.map((c) => c.name)).toEqual([
      'Sci-Fi',
      UNCHARTED,
    ]);
  });

  it('leaves books without links (or with a link to a missing book) alone', () => {
    const sky = buildSky(books, 1000);
    const lone = sky.stars.filter((s) => s.constellation === null);

    expect(lone.map((s) => s.book.id).sort()).toEqual([6, 7]);
  });

  it('puts lone stars in a band of their own below the constellations', () => {
    const sky = buildSky(books, 1000);
    const lowestLinked = Math.max(
      ...sky.stars.filter((s) => s.constellation !== null).map((s) => s.y),
    );

    expect(sky.loneTop).not.toBeNull();
    expect(sky.loneTop as number).toBeGreaterThan(lowestLinked);
    sky.stars
      .filter((s) => s.constellation === null)
      .forEach((s) => expect(s.y).toBeGreaterThan(sky.loneTop as number));
  });

  it('keeps stars off lines that are not their own', () => {
    // 1 leads to 3 directly and through 2, so 2 sits between them.
    const sky = buildSky([book(1, [2, 3]), book(2, [3]), book(3)], 1000);
    const [a, b, c] = [1, 2, 3].map(
      (id) => sky.stars.find((s) => s.book.id === id)!,
    );
    const t =
      ((b.x - a.x) * (c.x - a.x) + (b.y - a.y) * (c.y - a.y)) /
      ((c.x - a.x) ** 2 + (c.y - a.y) ** 2);
    const q = { x: a.x + t * (c.x - a.x), y: a.y + t * (c.y - a.y) };

    expect(Math.hypot(b.x - q.x, b.y - q.y)).toBeGreaterThan(30);
  });

  it('keeps every star inside the sky, even on a narrow screen', () => {
    const sky = buildSky(books, 320);

    sky.stars.forEach((star) => {
      expect(star.x).toBeGreaterThanOrEqual(0);
      expect(star.x).toBeLessThanOrEqual(sky.width);
      expect(star.y).toBeGreaterThanOrEqual(0);
      expect(star.y).toBeLessThanOrEqual(sky.height);
    });
  });

  it('lays the sky out the same way every time', () => {
    const first = buildSky(books, 1000).stars.map(({ x, y }) => [x, y]);
    const second = buildSky(books, 1000).stars.map(({ x, y }) => [x, y]);

    expect(second).toEqual(first);
  });
});
