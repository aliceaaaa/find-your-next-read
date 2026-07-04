import { useNavigate } from 'react-router-dom';
import { Book } from 'types';
import { Cover } from '../cover';
import { Button } from '../button';
import { EditIcon, TrashIcon } from '../../icons';
import styles from './admin-books.module.scss';

type AdminBooksProps = {
  books: Book[];
  isLoading: boolean;
};

export const AdminBooks = ({ books, isLoading }: AdminBooksProps) => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h2 className={styles.title}>Books</h2>
        <Button onClick={() => navigate('/admin/books/new')}>Add book</Button>
      </div>

      {isLoading ? (
        <p className={styles.empty}>Loading...</p>
      ) : books.length === 0 ? (
        <p className={styles.empty}>No books yet.</p>
      ) : (
        <ul className={styles.list}>
          {books.map((book) => (
            <li key={book.id} className={styles.row}>
              <Cover book={book} size="sm" />
              <div className={styles.info}>
                <span className={styles.bookTitle}>{book.title}</span>
                <span className={styles.bookAuthor}>{book.author}</span>
              </div>
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => navigate(`/admin/books/${book.id}/edit`)}
                  aria-label={`Edit ${book.title}`}
                >
                  <EditIcon size={16} />
                </button>
                <button
                  type="button"
                  className={styles.iconBtn}
                  disabled
                  title="Delete coming soon"
                  aria-label={`Delete ${book.title}`}
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
