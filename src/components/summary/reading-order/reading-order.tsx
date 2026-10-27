import cn from 'classnames';
import { Book } from 'types';
import { Cover } from '../../cover';
import { ArrowLeftIcon, ArrowRightIcon } from '../../../icons';
import styles from './reading-order.module.scss';

type ReadingOrderProps = {
  before: Book[];
  next: Book[];
  onBookSelect: (book: Book) => void;
};

export const ReadingOrder = ({
  before,
  next,
  onBookSelect,
}: ReadingOrderProps) => {
  if (before.length === 0 && next.length === 0) {
    return null;
  }

  return (
    <section className={styles.readingOrder} aria-label="Reading order">
      <h2 className={styles.title}>Reading order</h2>
      <div className={styles.columns}>
        <div className={styles.column}>
          {before.map((book) => (
            <LinkedBook
              key={book.id}
              book={book}
              direction="before"
              onSelect={onBookSelect}
            />
          ))}
        </div>
        <div className={cn(styles.column, styles.columnNext)}>
          {next.map((book) => (
            <LinkedBook
              key={book.id}
              book={book}
              direction="next"
              onSelect={onBookSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

type LinkedBookProps = {
  book: Book;
  direction: 'before' | 'next';
  onSelect: (book: Book) => void;
};

const LinkedBook = ({ book, direction, onSelect }: LinkedBookProps) => {
  const isNext = direction === 'next';

  return (
    <button
      type="button"
      className={cn(styles.item, isNext && styles.itemNext)}
      onClick={() => onSelect(book)}
    >
      {!isNext && <ArrowLeftIcon size={18} className={styles.arrow} />}
      <span className={styles.thumb}>
        <Cover book={book} size="sm" />
      </span>
      <span className={styles.text}>
        <span className={styles.label}>
          {isNext ? 'Read next' : 'Read before'}
        </span>
        <span className={styles.bookTitle}>{book.title}</span>
        <span className={styles.author}>{book.author}</span>
      </span>
      {isNext && <ArrowRightIcon size={18} className={styles.arrow} />}
    </button>
  );
};
