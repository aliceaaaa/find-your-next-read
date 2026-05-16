import { useState } from 'react';
import { Book } from 'types';
import { Card } from '../card';
import { CategoryFilter } from '../category-filter';
import styles from './library.module.scss';

type LibraryProps = {
  books: Book[];
  categories: string[];
  isLoading?: boolean;
  onBookSelect: (book: Book) => void;
  onBookmark: (id: number) => void;
};

const SkeletonCard = () => (
  <div className={styles.skeletonCard}>
    <div className={styles.skeletonCover} />
    <div className={styles.skeletonTitle} />
    <div className={styles.skeletonAuthor} />
    <div className={styles.skeletonRating} />
  </div>
);

export const Library = ({
  books,
  categories,
  isLoading = false,
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

      {isLoading ? (
        <div className={styles.grid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📚</span>
          <p className={styles.emptyTitle}>No books here yet</p>
          <p className={styles.emptySubtitle}>
            {activeCategory === 'All'
              ? 'Books will appear here once they are added to the library.'
              : `No books in the "${activeCategory}" category yet.`}
          </p>
        </div>
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
