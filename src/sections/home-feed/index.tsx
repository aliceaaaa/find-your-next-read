import { Book, BookOfTheDayPayload } from 'types';
import { Section } from 'components';
import { BookOfTheDay } from '../book-of-the-day';

type HomeFeedProps = {
  bookOfTheDayData?: BookOfTheDayPayload;
  isLoading?: boolean;
  popular: Book[];
  releases: Book[];
  onBookSelect: (book: Book) => void;
  onBookmark: (id: number) => void;
};

export const HomeFeed = ({
  bookOfTheDayData,
  isLoading = false,
  popular,
  releases,
  onBookSelect,
  onBookmark,
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
    <Section
      title="Popular Picks"
      books={popular}
      isLoading={isLoading}
      variant="popular"
      onBookSelect={onBookSelect}
      onBookmark={onBookmark}
    />
    <Section
      title="New Releases"
      books={releases}
      isLoading={isLoading}
      variant="new-releases"
      onBookSelect={onBookSelect}
    />
  </>
);
