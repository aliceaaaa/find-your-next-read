import { ReactNode, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Book } from 'types';
import { Card } from '../card';
import { MiniCard } from '../mini-card';
import { EmptyState } from '../empty-state';
import { Loader } from './loader';

import styles from './book-shelf.module.scss';

export type BookShelfCardType = 'full' | 'mini';
export type BookShelfLayout = 'row' | 'stretch' | 'grid';

type BookShelfProps = {
  books: Book[];
  isLoading?: boolean;
  title?: string;
  cardType?: BookShelfCardType;
  layout?: BookShelfLayout;
  maxRows?: number;
  skeletonCount?: number;
  emptyTitle?: string;
  emptySubtitle?: string;
  onBookmark?: (id: number) => void;
  onBookSelect: (book: Book) => void;
  onViewAll?: () => void;
  actions?: ReactNode;
};

export const BookShelf = ({
  books,
  isLoading = false,
  title,
  cardType = 'full',
  layout = 'row',
  maxRows,
  skeletonCount,
  emptyTitle = 'No books yet',
  emptySubtitle = 'Check back soon — great reads are on the way.',
  onBookmark,
  onBookSelect,
  onViewAll,
  actions,
}: BookShelfProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState<number | null>(null);
  const limitRows = layout === 'grid' && maxRows != null;

  useEffect(() => {
    const el = listRef.current;

    if (!limitRows || !el || typeof ResizeObserver === 'undefined') {
      return;
    }

    const measure = () => {
      const tracks = getComputedStyle(el)
        .gridTemplateColumns.split(' ')
        .filter(Boolean).length;
      setColumns(tracks || null);
    };

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener('resize', measure);
    measure();

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [limitRows]);

  const visibleBooks =
    limitRows && columns ? books.slice(0, columns * (maxRows ?? 1)) : books;

  const defaultSkeletonCount = cardType === 'mini' ? 6 : 4;
  const loaderCount = skeletonCount ?? defaultSkeletonCount;

  const renderList = () => {
    if (isLoading) {
      return <Loader cardType={cardType} count={loaderCount} />;
    }

    if (visibleBooks.length === 0) {
      return (
        <EmptyState
          className={styles.empty}
          icon="📖"
          title={emptyTitle}
          subtitle={emptySubtitle}
        />
      );
    }

    if (cardType === 'full') {
      return visibleBooks.map((book) => (
        <Card
          key={book.id}
          book={book}
          onSelect={onBookSelect}
          onBookmark={onBookmark || (() => {})}
          compact={layout === 'grid'}
        />
      ));
    }

    return visibleBooks.map((book) => (
      <MiniCard key={book.id} book={book} onSelect={onBookSelect} />
    ));
  };

  return (
    <div className={styles.shelf}>
      {title && (
        <div className={styles.header}>
          <h2>{title}</h2>
          {actions}
          {onViewAll && (
            <button className={styles.viewAll} onClick={onViewAll}>
              View all
            </button>
          )}
        </div>
      )}
      <div ref={listRef} className={cn(styles.list, styles[layout])}>
        {renderList()}
      </div>
    </div>
  );
};
