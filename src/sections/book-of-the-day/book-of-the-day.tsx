import { Card, StarRating } from 'components';
import { Book, Review } from 'types';
import styles from './book-of-the-day.module.scss';

type BookOfTheDayProps = {
  bookOfTheDay: Book;
  reviewsOfTheDay: Review[];
  onBookSelect: (book: Book) => void;
  onBookmark: (id: number) => void;
};

export const BookOfTheDay = ({
  bookOfTheDay,
  reviewsOfTheDay,
  onBookSelect,
  onBookmark,
}: BookOfTheDayProps) => (
  <div className={styles.wrapper}>
    <h2>Book of the Day</h2>
    <div className={styles.content}>
      <Card
        book={bookOfTheDay}
        onSelect={onBookSelect}
        onBookmark={onBookmark}
      />
      <div className={styles.reviewsWrap}>
        {reviewsOfTheDay.length === 0 ? (
          <section className={styles.reviewSection}>
            <h3 className={styles.reviewTitle}>No reviews yet</h3>
            <p className={styles.reviewText}>
              Nobody has reviewed {bookOfTheDay.title} yet.
            </p>
          </section>
        ) : (
          reviewsOfTheDay.map((review) => (
            <section key={review.id} className={styles.reviewSection}>
              <div className={styles.reviewHeader}>
                <div className={styles.avatar}>{review.authorInitials}</div>
                <h3 className={styles.reviewTitle}>
                  Review from {review.authorName}
                </h3>
              </div>
              <p className={styles.reviewText}>{review.text}</p>
              <button
                className={styles.readMore}
                onClick={() => onBookSelect(bookOfTheDay)}
              >
                Read the review →
              </button>
              <div className={styles.reviewMeta}>
                <StarRating rating={review.rating} size={13} />
                <span>{review.rating}/5</span>
              </div>
            </section>
          ))
        )}
      </div>
      <aside className={styles.infoPanel}>
        {bookOfTheDay.description && (
          <p className={styles.infoDescription}>{bookOfTheDay.description}</p>
        )}
        <hr className={styles.infoDivider} />
        <div className={styles.infoStats}>
          <div className={styles.infoStat}>
            <span className={styles.infoStatLabel}>Pages</span>
            <span className={styles.infoStatValue}>{bookOfTheDay.pages}</span>
          </div>
          <div className={styles.infoStat}>
            <span className={styles.infoStatLabel}>Published</span>
            <span className={styles.infoStatValue}>
              {bookOfTheDay.published}
            </span>
          </div>
          <div className={styles.infoStat}>
            <span className={styles.infoStatLabel}>Language</span>
            <span className={styles.infoStatValue}>
              {bookOfTheDay.language}
            </span>
          </div>
        </div>
        <hr className={styles.infoDivider} />
        <div className={styles.infoTags}>
          {bookOfTheDay.categories.map((cat) => (
            <span key={cat} className={styles.infoTag}>
              {cat}
            </span>
          ))}
        </div>
      </aside>
    </div>
  </div>
);
