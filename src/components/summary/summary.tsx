import { useState, useEffect } from 'react';

import { apiTrackImpression } from 'api';
import { Book, Review } from '../../types';
import { Cover } from '../cover';
import { ArrowLeftIcon } from '../../icons';

import { Reviews } from '../reviews';
import { RateBook } from '../rate-book';
import { ReviewForm } from '../review-form';
import { BookShelf } from '../book-shelf';
import { MainInfo } from './main-info';
import { SummaryMeta } from './summary-meta';

import styles from './summary.module.scss';

interface SummaryProps {
  book: Book;
  reviews: Review[];
  nextBooks?: Book[];
  onBack: () => void;
  onBookmark: (id: number) => void;
  onBookSelect?: (book: Book) => void;
  onCategorySelect?: (category: string) => void;
}

export const Summary = ({
  book,
  reviews,
  nextBooks = [],
  onBack,
  onBookmark,
  onBookSelect,
  onCategorySelect,
}: SummaryProps) => {
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    apiTrackImpression(book.id).catch(() => {});
  }, [book.id]);

  const bookReviews = reviews.filter((r) => r.bookId === book.id);
  const reviewCount = bookReviews.length;

  const reviewAverage = reviewCount
    ? Math.round(
        (bookReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount) * 10,
      ) / 10
    : 0;

  const bookWithRating: Book = {
    ...book,
    rating: reviewAverage,
    reviewCount,
  };

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
            book={bookWithRating}
            onBookmark={onBookmark}
            onCategorySelect={onCategorySelect}
          />
          <RateBook bookId={book.id} />
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
        <ReviewForm bookId={book.id} />
      </section>
      {nextBooks.length > 0 && onBookSelect && (
        <section className={styles.section}>
          <BookShelf
            title="Next books"
            books={nextBooks}
            cardType="full"
            onBookSelect={onBookSelect}
            onBookmark={onBookmark}
          />
        </section>
      )}
    </div>
  );
};
