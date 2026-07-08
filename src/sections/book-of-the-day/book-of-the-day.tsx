import { Card } from 'components';
import { Book, ReviewsOfTheDay } from 'types';
import { buildReviewData } from './utils';
import styles from './book-of-the-day.module.scss';

type BookOfTheDayProps = {
  bookOfTheDay: Book;
  reviewsOfTheDay: ReviewsOfTheDay;
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
        {buildReviewData(reviewsOfTheDay).map((review) => (
          <section key={review.key} className={styles.reviewSection}>
            <div className={styles.reviewHeader}>
              <div
                className={`${styles.avatar}${review.avatarClassName ? ` ${review.avatarClassName}` : ''}`}
              >
                {review.initial}
              </div>
              <h3 className={styles.reviewTitle}>{review.title}</h3>
            </div>
            <p className={styles.reviewText}>{review.text}</p>
            {review.rating !== null && (
              <button
                className={styles.readMore}
                onClick={() => onBookSelect(bookOfTheDay)}
              >
                Read the review →
              </button>
            )}
            <p className={styles.reviewMeta}>
              Rating:
              {review.rating === null
                ? ` ${review.title.replace('Review from ', '')} will review ${bookOfTheDay.title} as soon as possible`
                : ` ${review.rating}/5`}
            </p>
          </section>
        ))}
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
