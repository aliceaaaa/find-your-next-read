import { Book } from 'types';
import { Card } from '../card';
import { MiniCard } from '../mini-card';
import styles from './section.module.scss';

type SectionProps = {
  books: Book[];
  title: string;
  variant?: 'popular' | 'new-releases';
  onBookmark?: (id: number) => void;
  onBookSelect: (book: Book) => void;
  onViewAll?: () => void;
};

export const Section = ({
  books,
  title,
  variant = 'popular',
  onBookmark,
  onBookSelect,
  onViewAll,
}: SectionProps) => (
  <div className={styles['section']}>
    <div className={styles['header']}>
      <h2>{title}</h2>
      {onViewAll && (
        <button className={styles['view-all']} onClick={onViewAll}>
          View all
        </button>
      )}
    </div>
    <div className={styles['list']}>
      {variant === 'popular'
        ? books.map((book) => (
            <Card
              key={book.id}
              book={book}
              onSelect={onBookSelect}
              onBookmark={onBookmark || (() => {})}
            />
          ))
        : books.map((book) => (
            <MiniCard key={book.id} book={book} onSelect={onBookSelect} />
          ))}
    </div>
  </div>
);
