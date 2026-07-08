import cn from 'classnames';
import { Book } from 'types';
import styles from './cover.module.scss';

type CoverProps = {
  book: Book;
  size?: 'sm' | 'md' | 'lg';
};

export const Cover = ({ book, size = 'md' }: CoverProps) => (
  <div
    data-testid="cover"
    className={cn(styles.cover, styles[size])}
    style={{ backgroundColor: book.coverColor }}
  >
    <span className={styles.author}>{book.author.split(' ').slice(-1)[0]}</span>
    <h3 className={styles.title}>
      <span
        className={styles.titleText}
        style={{ color: book.coverTextColor || '#FFFFFF' }}
      >
        {book.title.toUpperCase()}
      </span>
    </h3>
    <span
      className={styles.subtitle}
      style={{ color: book.coverTextColor || '#FFFFFF', opacity: 0.7 }}
    >
      A Novel
    </span>
  </div>
);
