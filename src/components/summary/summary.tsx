import { useState } from 'react';

import { Book, Review } from '../../types';
import { Cover } from '../cover';
import { ArrowLeftIcon } from '../../icons';

import { Reviews } from '../reviews';
import { ReviewEditor } from '../review-editor';
import { MainInfo } from './main-info';
import { SummaryMeta } from './summary-meta';

import styles from './summary.module.scss';

interface SummaryProps {
  book: Book;
  reviews: Review[];
  isAdmin?: boolean;
  onBack: () => void;
  onBookmark: (id: number) => void;
}

export const Summary = ({
  book,
  reviews,
  isAdmin = false,
  onBack,
  onBookmark,
}: SummaryProps) => {
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(
    new Set(),
  );
  const [addingReview, setAddingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);

  const bookReviews = reviews.filter((r) => r.bookId === book.id);
  const editingReview =
    editingReviewId !== null
      ? bookReviews.find((r) => r.id === editingReviewId) ?? null
      : null;

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
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>What I Think</h2>
            {isAdmin && !addingReview && editingReviewId === null && (
              <button
                className={styles.addBtn}
                onClick={() => setAddingReview(true)}
              >
                + Add review
              </button>
            )}
          </div>

          {isAdmin && addingReview && (
            <ReviewEditor
              bookId={book.id}
              onDone={() => setAddingReview(false)}
            />
          )}

          {isAdmin && editingReview && (
            <ReviewEditor
              bookId={book.id}
              review={editingReview}
              onDone={() => setEditingReviewId(null)}
            />
          )}

          {bookReviews.length === 0 &&
          !addingReview &&
          editingReviewId === null ? (
            <p className={styles.empty}>No reviews yet. Be the first !</p>
          ) : (
            <Reviews
              reviews={bookReviews}
              expandedReviews={expandedReviews}
              onToggleReview={toggleReview}
              isAdmin={isAdmin}
              onEditReview={(id) => {
                setAddingReview(false);
                setEditingReviewId(id);
              }}
            />
          )}
        </section>
      </div>
    </div>
  );
};
