import cn from 'classnames';
import { Book } from 'types';
import { Cover } from '../../cover';
import { ChevronDownIcon, ChevronUpIcon } from '../../../icons';
import styles from './reading-order.module.scss';

type ReadingOrderProps = {
  books: Book[];
  direction: 'before' | 'next';
  onBookSelect: (book: Book) => void;
};

export const ReadingOrder = ({
  books,
  direction,
  onBookSelect,
}: ReadingOrderProps) => {
  if (books.length === 0) {
    return null;
  }

  const isNext = direction === 'next';
  const Arrow = isNext ? ChevronDownIcon : ChevronUpIcon;

  return (
    <nav
      className={cn(styles.readingOrder, isNext && styles.next)}
      aria-label={isNext ? 'Read next' : 'Read before'}
    >
      <span className={styles.label}>
        <Arrow size={13} strokeWidth={2.2} />
        {isNext ? 'Read next' : 'Read before'}
      </span>
      {books.map((book) => (
        <button
          key={book.id}
          type="button"
          className={styles.item}
          onClick={() => onBookSelect(book)}
          title={`${book.title} by ${book.author}`}
        >
          <span className={styles.thumb}>
            <Cover book={book} size="sm" />
          </span>
          <span className={styles.text}>
            <span className={styles.bookTitle}>{book.title}</span>
            <span className={styles.author}>{book.author}</span>
          </span>
        </button>
      ))}
    </nav>
  );
};
