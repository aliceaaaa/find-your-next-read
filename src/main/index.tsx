import { useMemo, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate,
} from 'react-router-dom';
import { Book, NavItemId, Post, PostStatus } from 'types';
import { HomeFeed, PlaceholderPage } from 'sections';
import { Summary, Library, Page, PostEditor } from 'components';
import { navFromPath, navPathMap } from '../constants';
import { useBookOfTheDay } from './hooks/use-book-of-the-day';
import { useBook } from '../hooks/use-book';
import { useBooks } from '../hooks/use-books';

export const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const summaryMatch = useMatch('/books/:bookId/summary');

  const [activeCategory, setActiveCategory] = useState('All');
  const [bookmarkOverrides, setBookmarkOverrides] = useState<Record<number, boolean>>({});

  const isAdmin = true;

  const { data: apiBooks = [], isLoading } = useBooks();

  const allBooks: Book[] = apiBooks.map((b) => ({
    ...b,
    isBookmarked: bookmarkOverrides[b.id] ?? b.isBookmarked ?? false,
  }));

  const half = Math.ceil(allBooks.length / 2);
  const popular = allBooks.slice(0, half);
  const releases = allBooks.slice(half);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(allBooks.flatMap((b) => b.categories)))],
    [allBooks],
  );

  const favoritesBooks = allBooks.filter((book) => book.isBookmarked);

  const { data: bookOfTheDayData } = useBookOfTheDay({
    popular,
    releases,
    reviews: [],
  });

  const locationState = location.state as { from?: string } | null;
  const bookId = summaryMatch?.params.bookId
    ? Number(summaryMatch.params.bookId)
    : null;

  const { data: fetchedBook } = useBook(bookId);

  const summaryBook = bookId
    ? allBooks.find((book) => book.id === bookId) || null
    : null;

  const summaryReviews = fetchedBook?.reviews ?? [];

  const activeNavFromRoute = location.pathname.startsWith('/books/')
    ? navFromPath(locationState?.from || '/library')
    : navFromPath(location.pathname);

  const handleSavePost = (data: Omit<Post, 'id' | 'createdAt'>, status: PostStatus) => {
    console.log('Post saved:', { ...data, status });
  };

  const handleBookmark = (id: number) => {
    setBookmarkOverrides((prev) => {
      const current = allBooks.find((b) => b.id === id);
      const currentState = prev[id] ?? current?.isBookmarked ?? false;
      return { ...prev, [id]: !currentState };
    });
  };

  const handleNavChange = (id: NavItemId) => {
    const path = navPathMap[id as keyof typeof navPathMap];
    if (path) {
      navigate(path);
    }
  };

  const handleBookSelect = (book: Book) => {
    navigate(`/books/${book.id}/summary`, {
      state: { from: location.pathname },
    });
  };

  const handleSummaryBack = () => {
    navigate(locationState?.from || '/library');
  };

  return (
    <Page
      activeNav={activeNavFromRoute}
      isAdmin={isAdmin}
      onNavChange={handleNavChange}
    >
      <Routes>
        <Route
          path="/"
          element={
            <HomeFeed
              activeCategory={activeCategory}
              bookOfTheDayData={bookOfTheDayData}
              categories={categories}
              isLoading={isLoading}
              onCategoryChange={setActiveCategory}
              popular={popular}
              releases={releases}
              onBookSelect={handleBookSelect}
              onBookmark={handleBookmark}
            />
          }
        />
        <Route
          path="/search"
          element={
            <HomeFeed
              activeCategory={activeCategory}
              bookOfTheDayData={bookOfTheDayData}
              categories={categories}
              isLoading={isLoading}
              onCategoryChange={setActiveCategory}
              popular={popular}
              releases={releases}
              onBookSelect={handleBookSelect}
              onBookmark={handleBookmark}
            />
          }
        />
        <Route
          path="/library"
          element={
            <Library
              books={allBooks}
              categories={categories}
              isLoading={isLoading}
              onBookSelect={handleBookSelect}
              onBookmark={handleBookmark}
            />
          }
        />
        <Route
          path="/favorites"
          element={
            <Library
              books={favoritesBooks}
              categories={categories}
              onBookSelect={handleBookSelect}
              onBookmark={handleBookmark}
            />
          }
        />
        <Route path="/profile" element={<PlaceholderPage title="Profile" />} />
        <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
        <Route
          path="/create-post"
          element={
            isAdmin ? (
              <PostEditor
                books={allBooks}
                categories={categories}
                onSave={handleSavePost}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/books/:bookId/summary"
          element={
            summaryBook ? (
              <Summary
                book={summaryBook}
                reviews={summaryReviews}
                onBack={handleSummaryBack}
                onBookmark={handleBookmark}
              />
            ) : (
              <Navigate to="/library" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Page>
  );
};
