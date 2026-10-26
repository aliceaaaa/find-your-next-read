import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import { Book } from 'types';
import {
  LABEL_MAX_CHARS,
  STAR_LABEL_MAX_CHARS,
  Star,
  buildSky,
} from './layout';
import styles from './connections.module.scss';

type ConnectionsPageProps = {
  books: Book[];
  isLoading?: boolean;
  onBookSelect: (book: Book) => void;
};

// The layout is redone only when the width changes by a full step, not on
// every pixel of a window resize.
const WIDTH_STEP = 40;

const truncate = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max - 1)}…` : text;

const useWidth = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;

    if (!el) {
      return;
    }

    const measure = () =>
      setWidth(Math.floor(el.clientWidth / WIDTH_STEP) * WIDTH_STEP);

    measure();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(measure);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return { ref, width };
};

// The line stops short of both stars, so the arrowhead stays visible.
const trim = (from: Star, to: Star) => {
  const length = Math.hypot(to.x - from.x, to.y - from.y) || 1;
  const ux = (to.x - from.x) / length;
  const uy = (to.y - from.y) / length;
  const start = from.r + 4;
  const end = to.r * 2 + 4;

  return {
    x1: from.x + ux * start,
    y1: from.y + uy * start,
    x2: to.x - ux * end,
    y2: to.y - uy * end,
  };
};

const StarLabel = ({ star, width }: { star: Star; width: number }) => {
  const alignEnd = star.x > width * 0.65;
  const below = star.y < 60;
  const x = star.x + (alignEnd ? -16 : 16);
  const y = star.y + (below ? 24 : -20);

  return (
    <text
      className={styles.label}
      x={x}
      y={y}
      textAnchor={alignEnd ? 'end' : 'start'}
    >
      <tspan className={styles['label-title']}>
        {truncate(star.book.title, 34)}
      </tspan>
      <tspan className={styles['label-author']} x={x} dy={14}>
        {truncate(star.book.author, 38)}
      </tspan>
    </text>
  );
};

export const ConnectionsPage = ({
  books,
  isLoading = false,
  onBookSelect,
}: ConnectionsPageProps) => {
  const { ref, width } = useWidth();
  const [active, setActive] = useState<number | null>(null);

  const sky = useMemo(
    () => (width > 0 && books.length > 0 ? buildSky(books, width) : null),
    [books, width],
  );

  useEffect(() => setActive(null), [sky]);

  const activeStar = sky && active !== null ? sky.stars[active] : null;
  const activeConstellation = activeStar?.constellation ?? null;

  // Names of stars near the edge grow inwards so they are not cut off.
  const starNameAnchor = (star: Star) => {
    if (!sky || star.x < 70) {
      return 'start';
    }

    return star.x > sky.width - 70 ? 'end' : 'middle';
  };

  const renderStar = (star: Star, index: number) => (
    <g
      key={star.book.id}
      className={cn(styles.star, {
        [styles.lone]: star.constellation === null,
        [styles.active]: index === active,
        [styles.dim]:
          activeStar !== null &&
          index !== active &&
          (star.constellation === null ||
            star.constellation !== activeConstellation),
      })}
      transform={`translate(${star.x} ${star.y})`}
      role="button"
      tabIndex={0}
      aria-label={`${star.book.title} by ${star.book.author}`}
      onMouseEnter={() => setActive(index)}
      onMouseLeave={() => setActive(null)}
      onFocus={() => setActive(index)}
      onBlur={() => setActive(null)}
      onClick={() => onBookSelect(star.book)}
      onKeyDown={(event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onBookSelect(star.book);
        }
      }}
    >
      <circle className={styles.hit} r={15} />
      <circle className={styles.halo} r={star.r * 3.2} />
      <circle className={styles.ring} r={star.r * 2.2} />
      <circle
        className={styles.core}
        r={star.r}
        style={{ animationDelay: `${star.twinkleDelay}s` }}
      />
      {index !== active && (
        <text
          className={styles['star-name']}
          y={star.r + 16}
          textAnchor={starNameAnchor(star)}
        >
          {truncate(star.book.title, STAR_LABEL_MAX_CHARS)}
        </text>
      )}
    </g>
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>Star chart</p>
        <h1 className={styles.title}>
          Book <em>constellations</em>
        </h1>
        <p className={styles.subtitle}>
          Every book is a star. When we say which book to read next, the two
          stars are joined, and a reading order becomes a constellation. Hover
          a star to light up its path, click it to open the book.
        </p>
        <ul className={styles.legend}>
          <li>
            <span className={cn(styles.swatch, styles['swatch-link'])} />
            Read next
          </li>
          <li>
            <span className={cn(styles.swatch, styles['swatch-star'])} />
            Has reviews
          </li>
          <li>
            <span className={cn(styles.swatch, styles['swatch-lone'])} />
            No path yet
          </li>
        </ul>
      </header>

      <div ref={ref} className={styles['sky-wrap']}>
        {!sky && !isLoading && (
          <p className={styles.empty}>The sky is empty for now.</p>
        )}

        {sky && (
          <svg
            viewBox={`0 0 ${sky.width} ${sky.height}`}
            width={sky.width}
            height={sky.height}
            className={cn(styles.sky, {
              [styles.focused]: activeStar !== null,
            })}
            role="group"
            aria-label="Book constellations"
          >
            <defs>
              <marker
                id="read-next-arrow"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M0 1L9 5L0 9z" className={styles.arrow} />
              </marker>
            </defs>

            <g className={styles.dust} aria-hidden="true">
              {sky.dust.map((speck, i) => (
                <circle key={i} cx={speck.x} cy={speck.y} r={speck.r} />
              ))}
            </g>

            {sky.constellations.map((constellation, ci) => (
              <g
                key={constellation.name}
                className={cn(styles.constellation, {
                  [styles.current]: ci === activeConstellation,
                })}
              >
                {constellation.links.map(([from, to]) => (
                  <line
                    key={`${from}-${to}`}
                    className={cn(styles.link, {
                      [styles.lit]: from === active || to === active,
                    })}
                    {...trim(sky.stars[from], sky.stars[to])}
                    pathLength={1}
                    markerEnd="url(#read-next-arrow)"
                  />
                ))}
                <text
                  className={styles.name}
                  x={constellation.labelX}
                  y={constellation.labelY}
                >
                  ✶ {truncate(constellation.name, LABEL_MAX_CHARS)}
                </text>
                {constellation.stars.map((index) =>
                  renderStar(sky.stars[index], index),
                )}
              </g>
            ))}

            {sky.loneTop !== null && (
              <g className={styles.horizon} aria-hidden="true">
                <line
                  x1={24}
                  x2={sky.width - 24}
                  y1={sky.loneTop}
                  y2={sky.loneTop}
                />
                <text x={sky.width / 2} y={sky.loneTop + 26}>
                  ✶ Lone stars · no reading path yet ✶
                </text>
              </g>
            )}

            <g>
              {sky.stars.map((star, index) =>
                star.constellation === null ? renderStar(star, index) : null,
              )}
            </g>

            {activeStar && <StarLabel star={activeStar} width={sky.width} />}
          </svg>
        )}
      </div>
    </div>
  );
};
