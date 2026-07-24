import { Book } from 'types';
import { Card } from '../card';
import { CategoryFilter } from '../category-filter';
import { EmptyState } from '../empty-state';
import { SkeletonCard } from '../skeleton-card';
import styles from './library.module.scss';

type LibraryProps = {
  books: Book[];
  categories: string[];
  isLoading?: boolean;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onBookSelect: (book: Book) => void;
  onBookmark: (id: number) => void;
};

export const Library = ({
  books,
  categories,
  isLoading = false,
  activeCategory,
  onCategoryChange,
  onBookSelect,
  onBookmark,
}: LibraryProps) => {
  const filtered =
    activeCategory === 'All'
      ? books
      : books.filter((b) => b.categories.includes(activeCategory));

  const emptySubtitle =
    activeCategory === 'All'
      ? 'Books will appear here once they are added to the library.'
      : `No books in the "${activeCategory}" category yet.`;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={styles.grid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }

    if (filtered.length === 0) {
      return (
        <EmptyState
          className={styles.empty}
          title="No books here yet"
          subtitle={emptySubtitle}
        />
      );
    }

    return (
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
    );
  };

  return (
    <div className={styles.library}>
      <CategoryFilter
        categories={categories}
        active={activeCategory}
        onChange={onCategoryChange}
      />

      {renderContent()}
    </div>
  );
};
