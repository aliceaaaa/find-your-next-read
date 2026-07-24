import { Book } from 'types';
import { Card } from '../card';
import { MiniCard } from '../mini-card';
import { EmptyState } from '../empty-state';
import { Loader } from './loader';

import styles from './book-shelf.module.scss';

export type BookShelfCardType = 'full' | 'mini';

type BookShelfProps = {
  books: Book[];
  isLoading?: boolean;
  title?: string;
  cardType?: BookShelfCardType;
  skeletonCount?: number;
  emptyTitle?: string;
  emptySubtitle?: string;
  onBookmark?: (id: number) => void;
  onBookSelect: (book: Book) => void;
  onViewAll?: () => void;
};

export const BookShelf = ({
  books,
  isLoading = false,
  title,
  cardType = 'full',
  skeletonCount,
  emptyTitle = 'No books yet',
  emptySubtitle = 'Check back soon — great reads are on the way.',
  onBookmark,
  onBookSelect,
  onViewAll,
}: BookShelfProps) => {
  const defaultSkeletonCount = cardType === 'mini' ? 6 : 4;
  const loaderCount = skeletonCount ?? defaultSkeletonCount;

  const renderList = () => {
    if (isLoading) {
      return <Loader cardType={cardType} count={loaderCount} />;
    }

    if (books.length === 0) {
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
      return books.map((book) => (
        <Card
          key={book.id}
          book={book}
          onSelect={onBookSelect}
          onBookmark={onBookmark || (() => {})}
        />
      ));
    }

    return books.map((book) => (
      <MiniCard key={book.id} book={book} onSelect={onBookSelect} />
    ));
  };

  return (
    <div className={styles.shelf}>
      {title && (
        <div className={styles.header}>
          <h2>{title}</h2>
          {onViewAll && (
            <button className={styles.viewAll} onClick={onViewAll}>
              View all
            </button>
          )}
        </div>
      )}
      <div className={styles.list}>{renderList()}</div>
    </div>
  );
};
