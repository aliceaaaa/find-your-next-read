import { useState } from 'react';
import { useBookRating } from '../../hooks';
import styles from './rate-book.module.scss';

type RateBookProps = {
  bookId: number;
};

export const RateBook = ({ bookId }: RateBookProps) => {
  const { rating, setRating } = useBookRating(bookId);
  const [hover, setHover] = useState<number | null>(null);

  const activeStars = hover ?? (rating != null ? rating / 2 : 0);

  return (
    <div className={styles.rate}>
      <span className={styles.label}>Your rating:</span>
      <div
        className={styles.stars}
        onMouseLeave={() => setHover(null)}
        role="radiogroup"
        aria-label="Rate this book"
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={styles.star}
            aria-label={`${star} of 5`}
            aria-checked={rating != null && rating / 2 === star}
            role="radio"
            onMouseEnter={() => setHover(star)}
            onClick={() => setRating(star * 2)}
          >
            <span className={star <= activeStars ? styles.on : styles.off}>
              ★
            </span>
          </button>
        ))}
      </div>
      {rating != null && <span className={styles.value}>{rating}/10</span>}
    </div>
  );
};
