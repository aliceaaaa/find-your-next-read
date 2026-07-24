import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Book } from 'types';
import { Button, Card, EmptyState, SkeletonCard } from 'components';
import { useBookSearch } from '../../hooks';
import styles from './search-results.module.scss';

type SearchResultsProps = {
  bookmarks: Record<number, boolean>;
  onBookSelect: (book: Book) => void;
  onBookmark: (id: number) => void;
};

export const SearchResults = ({
  bookmarks,
  onBookSelect,
  onBookmark,
}: SearchResultsProps) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  const {
    data,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useBookSearch(query);

  const total = data?.pages[0]?.total;

  const results = useMemo(
    () =>
      (data?.pages.flatMap((page) => page.books) ?? []).map((book) => ({
        ...book,
        isBookmarked: bookmarks[book.id] ?? false,
      })),
    [data, bookmarks],
  );

  const isInitialLoading = isFetching && !isFetchingNextPage;

  const emptySubtitle = query
    ? `We couldn't find anything for “${query}”. Try another title, author, or genre.`
    : 'Type something in the search bar to find your next read.';

  const renderResults = () => {
    if (isInitialLoading) {
      return (
        <div className={styles.grid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }

    if (results.length === 0) {
      return (
        <EmptyState
          className={styles.empty}
          icon="🔍"
          title="No matching books"
          subtitle={emptySubtitle}
        />
      );
    }

    return (
      <>
        <div className={styles.grid}>
          {results.map((book) => (
            <Card
              key={book.id}
              book={book}
              onSelect={onBookSelect}
              onBookmark={onBookmark}
            />
          ))}
        </div>

        {hasNextPage && (
          <div className={styles.loadMore}>
            <Button
              variant="secondary"
              onClick={() => fetchNextPage()}
              loading={isFetchingNextPage}
              disabled={isFetchingNextPage}
            >
              Load more
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className={styles.results}>
      <h2 className={styles.heading}>
        Results for <em>“{query}”</em>
        {typeof total === 'number' && !isInitialLoading && (
          <span className={styles.count}> · {total}</span>
        )}
      </h2>

      {renderResults()}
    </div>
  );
};
