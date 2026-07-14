import { useState } from 'react';

import { Book, Review } from '../../types';
import { Cover } from '../cover';
import { ArrowLeftIcon } from '../../icons';

import { Reviews } from '../reviews';
import { MainInfo } from './main-info';
import { SummaryMeta } from './summary-meta';

import styles from './summary.module.scss';

interface SummaryProps {
  book: Book;
  reviews: Review[];
  onBack: () => void;
  onBookmark: (id: number) => void;
  onCategorySelect?: (category: string) => void;
}

export const Summary = ({
  book,
  reviews,
  onBack,
  onBookmark,
  onCategorySelect,
}: SummaryProps) => {
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(
    new Set(),
  );
  const bookReviews = reviews.filter((r) => r.bookId === book.id);

  const toggleReview = (id: number) => {
    setExpandedReviews((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  return (
    <div className={styles.summary}>
      <button className={styles.back} onClick={onBack}>
        <ArrowLeftIcon size={16} /> Back
      </button>
      <div
        className={styles.hero}
        style={{ background: `${book.coverColor}14` }}
      >
        <div className={styles.coverWrap}>
          <Cover book={book} size="lg" />
        </div>
        <div className={styles.headline}>
          <MainInfo
            book={book}
            onBookmark={onBookmark}
            onCategorySelect={onCategorySelect}
          />
          {book.description && (
            <p className={styles.description}>{book.description}</p>
          )}
          <SummaryMeta book={book} />
        </div>
      </div>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Reviews{bookReviews.length > 0 ? ` (${bookReviews.length})` : ''}
        </h2>
        {bookReviews.length === 0 ? (
          <p className={styles.empty}>No reviews yet.</p>
        ) : (
          <Reviews
            reviews={bookReviews}
            expandedReviews={expandedReviews}
            onToggleReview={toggleReview}
          />
        )}
      </section>
    </div>
  );
};
