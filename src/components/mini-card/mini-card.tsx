import { Book } from 'types';
import { Cover } from '../cover';
import styles from './mini-card.module.scss';

type MiniCardProps = {
  book: Book;
  onSelect: (book: Book) => void;
};

export const MiniCard = ({ book, onSelect }: MiniCardProps) => (
  <div className={styles['mini-card']} onClick={() => onSelect(book)}>
    <Cover book={book} size="sm" />
  </div>
);
