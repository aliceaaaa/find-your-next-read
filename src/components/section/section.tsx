import { Book } from 'types';
import { Card } from '../card';
import { MiniCard } from '../mini-card';
import styles from './section.module.scss';

type SectionProps = {
  books: Book[];
  isLoading?: boolean;
  title: string;
  variant?: 'popular' | 'new-releases';
  onBookmark?: (id: number) => void;
  onBookSelect: (book: Book) => void;
  onViewAll?: () => void;
};

const SKELETON_COUNT = { popular: 4, 'new-releases': 6 };

const SkeletonPopular = () => (
  <div className={styles.skeletonCard}>
    <div className={styles.skeletonCover} />
    <div className={styles.skeletonTitle} />
    <div className={styles.skeletonAuthor} />
    <div className={styles.skeletonRating} />
  </div>
);

const SkeletonMini = () => <div className={styles.skeletonMiniCard} />;

const EMPTY_LABELS = {
  popular: { title: 'No popular picks yet', subtitle: 'Check back soon — great reads are on the way.' },
  'new-releases': { title: 'No new releases yet', subtitle: 'New books will appear here once added.' },
};

const EmptyState = ({ variant }: { variant: 'popular' | 'new-releases' }) => (
  <div className={styles.empty}>
    <span className={styles.emptyIcon}>📖</span>
    <p className={styles.emptyTitle}>{EMPTY_LABELS[variant].title}</p>
    <p className={styles.emptySubtitle}>{EMPTY_LABELS[variant].subtitle}</p>
  </div>
);

export const Section = ({
  books,
  isLoading = false,
  title,
  variant = 'popular',
  onBookmark,
  onBookSelect,
  onViewAll,
}: SectionProps) => (
  <div className={styles['section']}>
    <div className={styles['header']}>
      <h2>{title}</h2>
      {onViewAll && (
        <button className={styles['view-all']} onClick={onViewAll}>
          View all
        </button>
      )}
    </div>
    <div className={styles['list']}>
      {isLoading ? (
        Array.from({ length: SKELETON_COUNT[variant] }).map((_, i) =>
          variant === 'popular' ? <SkeletonPopular key={i} /> : <SkeletonMini key={i} />,
        )
      ) : books.length === 0 ? (
        <EmptyState variant={variant} />
      ) : variant === 'popular' ? (
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
