import { useState } from 'react';
import { Book } from 'types';
import { Card } from '../card';
import { CategoryFilter } from '../category-filter';
import styles from './library.module.scss';

type LibraryProps = {
  books: Book[];
  categories: string[];
  onBookSelect: (book: Book) => void;
  onBookmark: (id: number) => void;
};

export const Library = ({
  books,
  categories,
  onBookSelect,
  onBookmark,
}: LibraryProps) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? books
      : books.filter((b) => b.categories.includes(activeCategory));

  return (
    <div className={styles.library}>
      <CategoryFilter
        categories={categories}
        active={activeCategory}
        onChange={setActiveCategory}
      />

      {filtered.length === 0 ? (
        <p className={styles.empty}>No books in this category yet.</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map((book) => (
            <Card
              key={book.id}
              book={book}
              onSelect={onBookSelect}
              onBookmark={onBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
};
