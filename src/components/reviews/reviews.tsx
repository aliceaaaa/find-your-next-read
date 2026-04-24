import { Review } from 'types';
import { StarRating } from '../star-rating';
import styles from './reviews.module.scss';

type ReviewsProps = {
  reviews: Review[];
  expandedReviews: Set<number>;
  onToggleReview: (id: number) => void;
};

export const Reviews = ({
  reviews,
  expandedReviews,
  onToggleReview,
}: ReviewsProps) => (
  <div className={styles.reviews}>
    {reviews.map((review) => {
      const isLong = review.text.length > 140;
      const isExpanded = expandedReviews.has(review.id);
      const displayText =
        isLong && !isExpanded ? review.text.slice(0, 140) + '...' : review.text;

      return (
        <div key={review.id} className={styles.reviewCard}>
          <div className={styles.reviewHeader}>
            <div className={styles.avatar}>{review.authorInitials}</div>
            <div className={styles.reviewMeta}>
              <span className={styles.reviewAuthor}>{review.authorName}</span>
              <span className={styles.reviewDate}>{review.date}</span>
            </div>
            <StarRating rating={review.rating} size={13} />
          </div>
          <p className={styles.reviewText}>{displayText}</p>
          {isLong && (
            <button
              className={styles.readMore}
              onClick={() => onToggleReview(review.id)}
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      );
    })}
  </div>
);
