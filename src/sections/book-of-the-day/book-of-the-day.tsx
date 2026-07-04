import { Section } from 'components';
import { Book, ReviewsOfTheDay } from 'types';
import { languageName } from '../../constants';
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
    <div className={styles.content}>
      <div className={styles.bookColumn}>
        <Section
          title="Book Of The Day"
          books={[bookOfTheDay]}
          variant="popular"
          onBookSelect={onBookSelect}
          onBookmark={onBookmark}
        />
      </div>
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
            <button
              className={styles.readMore}
              onClick={() => onBookSelect(bookOfTheDay)}
            >
              Read the review →
            </button>
            <p className={styles.reviewMeta}>
              Rating:
              {review.rating === null
                ? `${review.title.replace('Review from ', '')} will review ${bookOfTheDay.title} as soon as possible`
                : `${review.rating}/5`}
            </p>
          </section>
        ))}
      </div>
      <aside className={styles.infoPanel}>
        <p className={styles.infoDescription}>{bookOfTheDay.description}</p>
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
              {languageName(bookOfTheDay.language)}
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
