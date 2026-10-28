import {
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { Book } from 'types';
import { Button } from 'components';
import {
  LABEL_MAX_CHARS,
  STAR_LABEL_MAX_CHARS,
  Star,
  buildSky,
} from './layout';
import { Link, useLinkEditor } from './use-link-editor';
import styles from './connections.module.scss';

type ConnectionsPageProps = {
  books: Book[];
  isLoading?: boolean;
  canEdit?: boolean;
  onBookSelect: (book: Book) => void;
};

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
  canEdit = false,
  onBookSelect,
}: ConnectionsPageProps) => {
  const { ref, width } = useWidth();
  const svgRef = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const editor = useLinkEditor();

  const sky = useMemo(
    () => (width > 0 && books.length > 0 ? buildSky(books, width) : null),
    [books, width],
  );

  useEffect(() => setActive(null), [sky]);

  useEffect(() => {
    if (!canEdit) {
      setEditing(false);
    }
  }, [canEdit]);

  const clearSelection = () => {
    setSelectedId(null);
    setSelectedLink(null);
    setPointer(null);
  };

  useEffect(() => {
    if (!editing) {
      return;
    }

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        clearSelection();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [editing]);

  const hasLink = (from: number, to: number) =>
    books.find((book) => book.id === from)?.nextBookIds?.includes(to) ?? false;

  const starOf = (bookId: number) =>
    sky?.stars.find((star) => star.book.id === bookId) ?? null;

  const selectedBook = selectedId === null ? null : starOf(selectedId)?.book;

  const handleStarClick = (book: Book) => {
    if (!editing) {
      onBookSelect(book);
      return;
    }

    setSelectedLink(null);

    if (selectedId === null) {
      setSelectedId(book.id);
      return;
    }

    const from = selectedId;
    const to = book.id;
    clearSelection();

    if (from === to || hasLink(from, to)) {
      return;
    }

    editor.mutate(
      hasLink(to, from)
        ? { remove: [to, from], add: [from, to] }
        : { add: [from, to] },
    );
  };

  const toggleEditing = () => {
    clearSelection();
    editor.reset();
    setEditing((value) => !value);
  };

  const handlePointerMove = (event: MouseEvent<SVGSVGElement>) => {
    const ctm = svgRef.current?.getScreenCTM();

    if (!editing || selectedId === null || !ctm) {
      return;
    }

    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      ctm.inverse(),
    );
    setPointer({ x: point.x, y: point.y });
  };

  const renderLinkToolbar = () => {
    const from = selectedLink && starOf(selectedLink[0]);
    const to = selectedLink && starOf(selectedLink[1]);
    const svg = svgRef.current;

    if (!selectedLink || !from || !to || !sky || !svg) {
      return null;
    }

    const scale = svg.clientWidth / sky.width;

    return (
      <div
        className={styles.toolbar}
        style={{
          left: ((from.x + to.x) / 2) * scale,
          top: ((from.y + to.y) / 2) * scale,
        }}
      >
        <span className={styles['toolbar-text']}>
          {truncate(from.book.title, 22)} → {truncate(to.book.title, 22)}
        </span>
        <button
          type="button"
          onClick={() => {
            editor.mutate({
              remove: selectedLink,
              add: [selectedLink[1], selectedLink[0]],
            });
            clearSelection();
          }}
        >
          ⇄ Reverse
        </button>
        <button
          type="button"
          onClick={() => {
            editor.mutate({ remove: selectedLink });
            clearSelection();
          }}
        >
          Remove
        </button>
        <button type="button" aria-label="Close" onClick={clearSelection}>
          ×
        </button>
      </div>
    );
  };

  const renderEditHint = () => {
    if (editor.isError) {
      return 'Could not save that change. Please try again.';
    }
    if (editor.isPending) {
      return 'Saving…';
    }
    if (selectedBook) {
      return `Now click the book to read after “${selectedBook.title}”. Esc to cancel.`;
    }

    return 'Click a book, then the book to read after it. Click a line to reverse or remove it.';
  };

  const activeStar = sky && active !== null ? sky.stars[active] : null;
  const activeConstellation = activeStar?.constellation ?? null;

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
        [styles.selected]: star.book.id === selectedId,
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
      onClick={() => handleStarClick(star.book)}
      onKeyDown={(event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleStarClick(star.book);
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
          stars are joined and a reading order becomes a constellation. Hover a
          star to light up its path, click it to open the book.
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
        {canEdit && (
          <div className={styles['edit-bar']}>
            <Button
              type="button"
              variant={editing ? 'primary' : 'ghost'}
              size="sm"
              onClick={toggleEditing}
            >
              {editing ? 'Done' : 'Edit connections'}
            </Button>
            {editing && (
              <p
                className={cn(styles['edit-hint'], {
                  [styles['edit-error']]: editor.isError,
                })}
                role="status"
              >
                {renderEditHint()}
              </p>
            )}
          </div>
        )}
      </header>

      <div ref={ref} className={styles['sky-wrap']}>
        {!sky && !isLoading && (
          <p className={styles.empty}>The sky is empty for now.</p>
        )}

        {sky && (
          <svg
            ref={svgRef}
            viewBox={`0 0 ${sky.width} ${sky.height}`}
            width={sky.width}
            height={sky.height}
            className={cn(styles.sky, {
              [styles.focused]: activeStar !== null,
              [styles.editing]: editing,
            })}
            onMouseMove={handlePointerMove}
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
                {constellation.links.map(([from, to]) => {
                  const link: Link = [
                    sky.stars[from].book.id,
                    sky.stars[to].book.id,
                  ];
                  const chosen =
                    selectedLink?.[0] === link[0] &&
                    selectedLink?.[1] === link[1];

                  return (
                    <g key={`${from}-${to}`}>
                      <line
                        className={cn(styles.link, {
                          [styles.lit]: from === active || to === active,
                          [styles.chosen]: chosen,
                        })}
                        {...trim(sky.stars[from], sky.stars[to])}
                        pathLength={1}
                        markerEnd="url(#read-next-arrow)"
                      />
                      {editing && (
                        <line
                          className={styles['link-hit']}
                          {...trim(sky.stars[from], sky.stars[to])}
                          onClick={() => {
                            setSelectedId(null);
                            setSelectedLink(link);
                          }}
                        />
                      )}
                    </g>
                  );
                })}
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

            {editing &&
              selectedId !== null &&
              pointer &&
              starOf(selectedId) && (
                <line
                  className={styles.preview}
                  x1={(starOf(selectedId) as Star).x}
                  y1={(starOf(selectedId) as Star).y}
                  x2={pointer.x}
                  y2={pointer.y}
                />
              )}

            {activeStar && <StarLabel star={activeStar} width={sky.width} />}
          </svg>
        )}

        {editing && renderLinkToolbar()}
      </div>
    </div>
  );
};
