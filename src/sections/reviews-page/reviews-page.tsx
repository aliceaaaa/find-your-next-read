import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import cn from 'classnames';
import { Book, Review } from 'types';
import { Button, Cover, EmptyState, StarRating } from 'components';
import { SearchIcon } from '../../icons';
import { useReviewSearch, useReviews } from '../../hooks';
import styles from './reviews-page.module.scss';

const TOP_REVIEWERS = 8;
const SEARCH_DELAY = 300;

type ReviewsPageProps = {
  books: Book[];
  onBookSelect: (book: Book, reviewId?: number) => void;
};

export const ReviewsPage = ({ books, onBookSelect }: ReviewsPageProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const author = searchParams.get('author') ?? '';
  const [input, setInput] = useState(author);

  useEffect(() => {
    setInput(author);
  }, [author]);

  useEffect(() => {
    const trimmed = input.trim();

    if (trimmed === author) {
      return;
    }

    const timer = setTimeout(() => {
      setSearchParams(trimmed ? { author: trimmed } : {}, { replace: true });
    }, SEARCH_DELAY);

    return () => clearTimeout(timer);
  }, [input, author, setSearchParams]);

  const selectAuthor = (name: string) => {
    setInput(name);
    setSearchParams(name ? { author: name } : {});
  };

  const { data: allReviews = [] } = useReviews();
  const topReviewers = useMemo(() => {
    const counts = new Map<string, number>();

    allReviews.forEach((review) =>
      counts.set(review.authorName, (counts.get(review.authorName) ?? 0) + 1),
    );

    return Array.from(counts, ([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
      .slice(0, TOP_REVIEWERS);
  }, [allReviews]);

  const {
    data,
    isPending,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useReviewSearch(author);

  const reviews = data?.pages.flatMap((page) => page.reviews) ?? [];
  const total = data?.pages[0]?.total ?? 0;
  const booksById = useMemo(
    () => new Map(books.map((book) => [book.id, book])),
    [books],
  );

  const renderList = () => {
    if (isPending) {
      return (
        <div className={styles.list}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={cn(styles.card, styles.skeleton)} />
          ))}
        </div>
      );
    }

    if (reviews.length === 0) {
      return (
        <EmptyState
          className={styles.empty}
          icon="💬"
          title="No reviews found"
          subtitle={
            author
              ? `Nobody matching “${author}” has written a review yet.`
              : 'Reviews will appear here once readers share their thoughts.'
          }
        />
      );
    }

    return (
      <>
        <div
          className={cn(
            styles.list,
            isFetching && !isFetchingNextPage && styles.stale,
          )}
        >
          {reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              book={booksById.get(review.bookId)}
              isActiveAuthor={review.authorName === author}
              onAuthorSelect={selectAuthor}
              onBookSelect={onBookSelect}
            />
          ))}
        </div>
        {hasNextPage && (
          <div className={styles.loadMore}>
            <Button
              variant="secondary"
              loading={isFetchingNextPage}
              onClick={() => fetchNextPage()}
            >
              Show more reviews
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Reviews</h2>
        <p className={styles.subtitle}>
          What readers think — find everything a reviewer has written.
        </p>
      </div>

      <label className={styles.search}>
        <SearchIcon size={18} className={styles.searchIcon} />
        <input
          type="search"
          className={styles.searchInput}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search by reviewer name…"
          aria-label="Search by reviewer name"
        />
      </label>

      {topReviewers.length > 0 && (
        <div className={styles.reviewers} aria-label="Top reviewers">
          <button
            type="button"
            className={cn(styles.chip, !author && styles.chipActive)}
            onClick={() => selectAuthor('')}
          >
            All reviewers
          </button>
          {topReviewers.map(({ name, count }) => (
            <button
              key={name}
              type="button"
              className={cn(styles.chip, author === name && styles.chipActive)}
              onClick={() => selectAuthor(name)}
            >
              <span className={styles.chipAvatar}>{name[0]}</span>
              {name}
              <span className={styles.chipCount}>{count}</span>
            </button>
          ))}
        </div>
      )}

      {!isPending && reviews.length > 0 && (
        <p className={styles.count}>
          {total} {total === 1 ? 'review' : 'reviews'}
          {author && (
            <>
              {' '}
              by <em>“{author}”</em>
            </>
          )}
        </p>
      )}

      {renderList()}
    </div>
  );
};

type ReviewItemProps = {
  review: Review;
  book?: Book;
  isActiveAuthor: boolean;
  onAuthorSelect: (name: string) => void;
  onBookSelect: (book: Book, reviewId?: number) => void;
};

const ReviewItem = ({
  review,
  book,
  isActiveAuthor,
  onAuthorSelect,
  onBookSelect,
}: ReviewItemProps) => (
  <article className={styles.card}>
    {book && (
      <button
        type="button"
        className={styles.cover}
        onClick={() => onBookSelect(book)}
        aria-label={`Open ${book.title}`}
      >
        <Cover book={book} size="sm" />
      </button>
    )}
    <div className={styles.body}>
      {book && (
        <button
          type="button"
          className={styles.bookTitle}
          onClick={() => onBookSelect(book)}
        >
          {book.title}
          <span className={styles.bookAuthor}>{book.author}</span>
        </button>
      )}
      <div className={styles.meta}>
        <button
          type="button"
          className={cn(
            styles.reviewer,
            isActiveAuthor && styles.reviewerActive,
          )}
          onClick={() => onAuthorSelect(review.authorName)}
          title={`All reviews by ${review.authorName}`}
        >
          <span className={styles.avatar}>{review.authorInitials}</span>
          {review.authorName}
        </button>
        <span className={styles.date}>{review.date}</span>
        <span className={styles.rating}>
          <StarRating rating={review.rating} outOf={10} size={13} />
          {review.rating}/10
        </span>
      </div>
      <p className={styles.text}>{review.text}</p>
      {book && (
        <button
          type="button"
          className={styles.readMore}
          onClick={() => onBookSelect(book, review.id)}
        >
          Read the review →
        </button>
      )}
    </div>
  </article>
);
