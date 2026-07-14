import { Book, BookOfTheDayPayload } from 'types';
import { BookShelf, CategoryFilter } from 'components';
import { BookOfTheDay } from '../book-of-the-day';

type HomeFeedProps = {
  activeCategory: string;
  bookOfTheDayData?: BookOfTheDayPayload;
  categories: string[];
  isLoading?: boolean;
  popular: Book[];
  releases: Book[];
  onBookSelect: (book: Book) => void;
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
}: HomeFeedProps) => (
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
      emptyTitle="No popular picks yet"
      emptySubtitle="Check back soon — great reads are on the way."
      onBookSelect={onBookSelect}
      onBookmark={onBookmark}
    />
    <BookShelf
      title="New Releases"
      books={releases}
      isLoading={isLoading}
      cardType="full"
      emptyTitle="No new releases yet"
      emptySubtitle="New books will appear here once added."
      onBookSelect={onBookSelect}
      onBookmark={onBookmark}
    />
  </>
);
