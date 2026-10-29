import { Fragment, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import {
  UserIcon,
  CalendarIcon,
  LibraryIcon,
  GlobeIcon,
  GridIcon,
} from '../../../icons';
import { Book } from 'types';
import styles from './summary-meta.module.scss';

type SummaryMetaProps = {
  book: Book;
  onCategorySelect?: (category: string) => void;
};

const META = [
  { Icon: UserIcon, label: 'Author', valueKey: 'author' },
  { Icon: CalendarIcon, label: 'Published', valueKey: 'published' },
  { Icon: LibraryIcon, label: 'Pages', valueKey: 'pages' },
  { Icon: GlobeIcon, label: 'Language', valueKey: 'language' },
] as const;

const useIsTruncated = <T extends HTMLElement>(text: string) => {
  const ref = useRef<T>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = ref.current;

    if (!el || typeof ResizeObserver === 'undefined') {
      return;
    }

    const check = () => setIsTruncated(el.scrollWidth > el.clientWidth);
    const observer = new ResizeObserver(check);
    observer.observe(el);
    check();

    return () => observer.disconnect();
  }, [text]);

  return { ref, isTruncated };
};

export const SummaryMeta = ({ book, onCategorySelect }: SummaryMetaProps) => {
  const genres = book.categories.join(', ');
  const { ref: genreRef, isTruncated } =
    useIsTruncated<HTMLSpanElement>(genres);

  return (
    <div className={styles.meta}>
      {META.map(({ Icon, label, valueKey }) => (
        <div key={label} className={styles.metaItem}>
          <div className={styles.metaTitle}>
            <span className={styles.metaIcon}>
              <Icon size={16} />
            </span>
            <span className={styles.metaLabel}>{label}</span>
          </div>
          <span className={styles.metaValue}>{book[valueKey]}</span>
        </div>
      ))}
      {book.categories.length > 0 && (
        <div className={cn(styles.metaItem, styles.genre)}>
          <div className={styles.metaTitle}>
            <span className={styles.metaIcon}>
              <GridIcon size={16} />
            </span>
            <span className={styles.metaLabel}>
              {book.categories.length > 1 ? 'Genres' : 'Genre'}
            </span>
          </div>
          <span
            className={cn(styles.genreValueWrap, {
              [styles.hasTooltip]: isTruncated,
            })}
            data-tooltip={isTruncated ? genres : undefined}
          >
            <span
              ref={genreRef}
              className={cn(styles.metaValue, styles.genreValue)}
            >
              {book.categories.map((category, index) => (
                <Fragment key={category}>
                  {index > 0 && ', '}
                  {onCategorySelect ? (
                    <button
                      type="button"
                      className={styles.genreLink}
                      onClick={() => onCategorySelect(category)}
                    >
                      {category}
                    </button>
                  ) : (
                    category
                  )}
                </Fragment>
              ))}
            </span>
          </span>
        </div>
      )}
    </div>
  );
};
