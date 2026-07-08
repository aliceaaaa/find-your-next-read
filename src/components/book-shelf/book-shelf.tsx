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
      <div className={styles.list}>
        {isLoading ? (
          <Loader
            cardType={cardType}
            count={skeletonCount ?? (cardType === 'mini' ? 6 : 4)}
          />
        ) : books.length === 0 ? (
          <EmptyState
            className={styles.empty}
            icon="📖"
            title={emptyTitle}
            subtitle={emptySubtitle}
          />
        ) : cardType === 'full' ? (
          books.map((book) => (
            <Card
              key={book.id}
              book={book}
              onSelect={onBookSelect}
              onBookmark={onBookmark || (() => {})}
            />
          ))
        ) : (
          books.map((book) => (
            <MiniCard key={book.id} book={book} onSelect={onBookSelect} />
          ))
        )}
      </div>
    </div>
  );
};
