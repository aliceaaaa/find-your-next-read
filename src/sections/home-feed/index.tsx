import { Book, BookOfTheDayPayload } from 'types';
import { CategoryFilter, Section } from 'components';
import { categories } from 'data/mock-data';
import { BookOfTheDay } from '../book-of-the-day';

type HomeFeedProps = {
  activeCategory: string;
  bookOfTheDayData?: BookOfTheDayPayload;
  popular: Book[];
  releases: Book[];
  onBookSelect: (book: Book) => void;
  onBookmark: (id: number) => void;
  onCategoryChange: (value: string) => void;
};

export const HomeFeed = ({
  activeCategory,
  bookOfTheDayData,
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
        reviewsOfTheDay={bookOfTheDayData.reviewsOfTheDay!}
        onBookSelect={onBookSelect}
        onBookmark={onBookmark}
      />
    )}
    <CategoryFilter
      categories={categories}
      active={activeCategory}
      onChange={onCategoryChange}
    />
    <Section
      title="Popular Picks"
      books={popular}
      variant="popular"
      onBookSelect={onBookSelect}
      onBookmark={onBookmark}
    />
    <Section
      title="New Releases"
      books={releases}
      variant="new-releases"
      onBookSelect={onBookSelect}
    />
  </>
);
