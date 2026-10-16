import { useState } from "react";
import { Review } from "types";
import { useAuth } from "../../contexts/auth-context";
import { StarRating } from "../star-rating";
import { EditButton } from "../edit-button";
import { ReviewForm } from "../review-form";
import styles from "./reviews.module.scss";

type ReviewsProps = {
  reviews: Review[];
  expandedReviews: Set<number>;
  onToggleReview: (id: number) => void;
};

export const Reviews = ({
  reviews,
  expandedReviews,
  onToggleReview,
}: ReviewsProps) => {
  const { isAdmin } = useAuth();
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <div className={styles.reviews}>
      {reviews.map((review) => {
        if (isAdmin && editingId === review.id) {
          return (
            <ReviewForm
              key={review.id}
              bookId={review.bookId}
              review={review}
              onCancel={() => setEditingId(null)}
              onSaved={() => setEditingId(null)}
            />
          );
        }

        const isLong = review.text.length > 1000;
        const isExpanded = expandedReviews.has(review.id);
        const displayText =
          isLong && !isExpanded
            ? review.text.slice(0, 1000) + "..."
            : review.text;

        return (
          <div key={review.id} className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <div className={styles.avatar}>{review.authorInitials}</div>
              <div className={styles.reviewMeta}>
                <span className={styles.reviewAuthor}>{review.authorName}</span>
                <span className={styles.reviewDate}>{review.date}</span>
              </div>
              <StarRating rating={review.rating} outOf={10} size={13} />
              {isAdmin && (
                <EditButton
                  onClick={() => setEditingId(review.id)}
                  label="Edit review"
                  size={16}
                />
              )}
            </div>
            <p className={styles.reviewText}>{displayText}</p>
            {isLong && (
              <button
                className={styles.readMore}
                onClick={() => onToggleReview(review.id)}
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
