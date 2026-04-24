import { useState } from 'react';
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
import {
  categories,
  popularBooks,
  newReleases,
  reviews,
} from '../data/mock-data';
import { navFromPath, navPathMap } from '../constants';
import { useBookOfTheDay } from './hooks/use-book-of-the-day';

export const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const summaryMatch = useMatch('/books/:bookId/summary');

  const [activeCategory, setActiveCategory] = useState('History');
  const [popular, setPopular] = useState(popularBooks);
  const [releases, setReleases] = useState(newReleases);
  const isAdmin = true;

  const allBooks = [...popular, ...releases];
  const favoritesBooks = allBooks.filter((book) => book.isBookmarked);
  const { data: bookOfTheDayData } = useBookOfTheDay({
    popular,
    releases,
    reviews,
  });

  const locationState = location.state as { from?: string } | null;
  const summaryBook = summaryMatch?.params.bookId
    ? allBooks.find((book) => book.id === Number(summaryMatch.params.bookId)) ||
      null
    : null;

  const activeNavFromRoute = location.pathname.startsWith('/books/')
    ? navFromPath(locationState?.from || '/library')
    : navFromPath(location.pathname);

  const handleSavePost = (
    data: Omit<Post, 'id' | 'createdAt'>,
    status: PostStatus,
  ) => {
    console.log('Post saved:', { ...data, status });
  };

  const handleBookmark = (id: number) => {
    setPopular((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, isBookmarked: !b.isBookmarked } : b,
      ),
    );

    setReleases((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, isBookmarked: !b.isBookmarked } : b,
      ),
    );
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
    const from = locationState?.from;
    navigate(from || '/library');
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
        <Route
          path="/settings"
          element={<PlaceholderPage title="Settings" />}
        />
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
                reviews={reviews}
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
