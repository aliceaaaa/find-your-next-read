import { useState } from 'react';
import cn from 'classnames';
import { Book, BookOfTheDayPayload } from 'types';
import { BookShelf, CategoryFilter } from 'components';
import { RELEASE_SORTS, ReleaseSort } from '../../hooks';
import { BookOfTheDay } from '../book-of-the-day';
import styles from './home-feed.module.scss';

const SORT_KEY = 'release_sort';

const readSort = (): ReleaseSort => {
  try {
    const saved = localStorage.getItem(SORT_KEY);

    return RELEASE_SORTS.some(({ id }) => id === saved)
      ? (saved as ReleaseSort)
      : 'reviewed';
  } catch {
    return 'reviewed';
  }
};

const saveSort = (sort: ReleaseSort) => {
  try {
    localStorage.setItem(SORT_KEY, sort);
  } catch {
  }
};

type HomeFeedProps = {
  activeCategory: string;
  bookOfTheDayData?: BookOfTheDayPayload;
  categories: string[];
  isLoading?: boolean;
  popular: Book[];
  releases: Record<ReleaseSort, Book[]>;
  onBookSelect: (book: Book, reviewId?: number) => void;
  onBookmark: (id: number) => void;
  onCategoryChange: (value: string) => void;
};

export const HomeFeed = ({
  activeCategory,
  bookOfTheDayData,
  categories,
  isLoading = false,
  popular,
  releases,
  onBookSelect,
  onBookmark,
  onCategoryChange,
}: HomeFeedProps) => {
  const [sort, setSort] = useState<ReleaseSort>(readSort);

  const sortOptions = (
    <div className={styles.sort} role="group" aria-label="Sort new releases">
      {RELEASE_SORTS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={cn(styles['sort-option'], {
            [styles.active]: id === sort,
          })}
          aria-pressed={id === sort}
          onClick={() => {
            setSort(id);
            saveSort(id);
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      {bookOfTheDayData?.bookOfTheDay && (
        <BookOfTheDay
          bookOfTheDay={bookOfTheDayData.bookOfTheDay}
          reviewsOfTheDay={bookOfTheDayData.reviewsOfTheDay}
          onBookSelect={onBookSelect}
          onBookmark={onBookmark}
        />
      )}
      <CategoryFilter
        categories={categories}
        active={activeCategory}
        onChange={onCategoryChange}
      />
      <BookShelf
        title="Popular Picks"
        books={popular}
        isLoading={isLoading}
        cardType="full"
        layout="stretch"
        emptyTitle="No popular picks yet"
        emptySubtitle="Check back soon — great reads are on the way."
        onBookSelect={onBookSelect}
        onBookmark={onBookmark}
      />
      <BookShelf
        title="New Releases"
        books={releases[sort]}
        isLoading={isLoading}
        cardType="full"
        layout="grid"
        maxRows={1}
        actions={sortOptions}
        emptyTitle="No new releases yet"
        emptySubtitle="New books will appear here once added."
        onBookSelect={onBookSelect}
        onBookmark={onBookmark}
      />
    </>
  );
};
