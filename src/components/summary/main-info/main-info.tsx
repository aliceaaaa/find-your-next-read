import { Book } from '../../../types';
import { StarRating } from '../../star-rating';
import { BookmarkButton } from '../../bookmark-button';
import { PencilIcon } from '../../../icons';
import styles from './main-info.module.scss';

type MainInfoProps = {
  book: Book;
  onBookmark: (id: number) => void;
  onEdit?: () => void;
  onCategorySelect?: (category: string) => void;
};

export const MainInfo = ({
  book,
  onBookmark,
  onEdit,
  onCategorySelect,
}: MainInfoProps) => (
  <div className={styles.mainInfo}>
    <div className={styles.titleRow}>
      <h1 className={styles.title}>{book.title}</h1>
      <div className={styles.actions}>
        {onEdit && (
          <button
            type="button"
            className={styles.editBtn}
            onClick={onEdit}
            aria-label="Edit book"
            data-tooltip="Edit book"
          >
            <PencilIcon size={20} />
          </button>
        )}
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
    </div>
    <div className={styles.ratingRow}>
      <StarRating rating={book.ratingAvg ?? 0} outOf={10} size={16} />
      <span className={styles.ratingText}>
        {book.ratingAvg != null
          ? `${book.ratingAvg.toFixed(1)}/10`
          : 'No ratings yet'}
        {book.reviewCount > 0 &&
          ` (${book.rating}/10 from ${book.reviewCount} ${
            book.reviewCount === 1 ? 'review' : 'reviews'
          })`}
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
