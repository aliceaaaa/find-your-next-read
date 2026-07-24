import { useState } from 'react';
import { useBookRating } from '../../hooks';
import styles from './rate-book.module.scss';

type RateBookProps = {
  bookId: number;
};

const fillPercent = (star: number, stars: number): number => {
  if (stars >= star) {
    return 100;
  }
  if (stars >= star - 0.5) {
    return 50;
  }
  return 0;
};

export const RateBook = ({ bookId }: RateBookProps) => {
  const { rating, setRating } = useBookRating(bookId);
  const [hover, setHover] = useState<number | null>(null);

  let currentRating = 0;
  if (rating != null) {
    currentRating = rating;
  }

  const activeRating = hover ?? currentRating;
  const activeStars = activeRating / 2;

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
          <span key={star} className={styles.star}>
            <span className={styles.starBg}>★</span>
            <span
              className={styles.starFill}
              style={{ width: `${fillPercent(star, activeStars)}%` }}
            >
              ★
            </span>
            <button
              type="button"
              className={styles.hitLeft}
              aria-label={`${star * 2 - 1} of 10`}
              onMouseEnter={() => setHover(star * 2 - 1)}
              onClick={() => setRating(star * 2 - 1)}
            />
            <button
              type="button"
              className={styles.hitRight}
              aria-label={`${star * 2} of 10`}
              onMouseEnter={() => setHover(star * 2)}
              onClick={() => setRating(star * 2)}
            />
          </span>
        ))}
      </div>
      {rating != null && <span className={styles.value}>{rating}/10</span>}
    </div>
  );
};
