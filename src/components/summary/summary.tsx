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
}

export const Summary = ({
  book,
  reviews,
  onBack,
  onBookmark,
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
      <div className={styles.coverWrap}>
        <Cover book={book} size="lg" />
      </div>
      <div className={styles.body}>
        <div className={styles.data}>
          <MainInfo book={book} onBookmark={onBookmark} />
          <SummaryMeta book={book} />
        </div>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What I Think</h2>
          {bookReviews.length === 0 ? (
            <p className={styles.empty}>No reviews yet. Be the first !</p>
          ) : (
            <Reviews
              reviews={bookReviews}
              expandedReviews={expandedReviews}
              onToggleReview={toggleReview}
            />
          )}
        </section>
      </div>
    </div>
  );
};
