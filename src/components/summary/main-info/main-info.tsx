import { Book } from '../../../types';
import { StarRating } from '../../star-rating';
import { BookmarkButton } from '../../bookmark-button';
import styles from './main-info.module.scss';

type MainInfoProps = {
  book: Book;
  onBookmark: (id: number) => void;
  onCategorySelect?: (category: string) => void;
};

export const MainInfo = ({
  book,
  onBookmark,
  onCategorySelect,
}: MainInfoProps) => (
  <div className={styles.mainInfo}>
    <div className={styles.titleRow}>
      <h1 className={styles.title}>{book.title}</h1>
      <BookmarkButton
        isBookmarked={book.isBookmarked}
        onClick={() => onBookmark(book.id)}
        size={22}
        ariaLabel="Bookmark"
        className={styles.bookmarkBtn}
        iconClassName={styles.bookmarkIcon}
        activeIconClassName={styles.bookmarkIconActive}
      />
    </div>
    <div className={styles.ratingRow}>
      <StarRating rating={book.rating} size={16} />
      <span className={styles.ratingText}>
        {book.rating} ({book.reviewCount}{' '}
        {book.reviewCount === 1 ? 'review' : 'reviews'})
      </span>
    </div>
    <div className={styles.categories}>
      {book.categories.map((cat) =>
        onCategorySelect ? (
          <button
            key={cat}
            className={styles.tag}
            onClick={() => onCategorySelect(cat)}
          >
            {cat}
          </button>
        ) : (
          <span key={cat} className={styles.tag}>
            {cat}
          </span>
        ),
      )}
    </div>
  </div>
);
