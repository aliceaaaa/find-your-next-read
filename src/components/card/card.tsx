import cn from 'classnames';
import { Book } from 'types';
import { Cover } from '../cover';
import { BookmarkButton } from '../bookmark-button';
import styles from './card.module.scss';

type CardProps = {
  book: Book;
  onSelect: (book: Book) => void;
  onBookmark: (id: number) => void;
  compact?: boolean;
};

export const Card = ({
  book,
  onSelect,
  onBookmark,
  compact = false,
}: CardProps) => (
  <article
    className={cn(styles.card, compact && styles.compact)}
    onClick={() => onSelect(book)}
  >
    <div className={styles.coverWrap}>
      <Cover book={book} size="md" />
    </div>
    <div className={styles.info}>
      <div className={styles.titleRow}>
        <h3 className={styles.title}> {book.title}</h3>
        <BookmarkButton
          isBookmarked={book.isBookmarked}
          size={compact ? 16 : 18}
          className={styles.bookmarkBtn}
          iconClassName={styles.bookmarkIcon}
          activeIconClassName={styles.bookmarkIconActive}
          onClick={(e) => {
            e.stopPropagation();
            onBookmark(book.id);
          }}
        />
      </div>
      <p className={styles.author}>Author: {book.author}</p>
      <div className={styles.rating}>
        <span className={styles.star}>★</span>
        <span className={styles.ratingNum}> {book.rating}</span>
      </div>
    </div>
  </article>
);
