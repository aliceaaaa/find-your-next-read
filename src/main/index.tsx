import { useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Post, PostStatus } from 'types';
import { HomeFeed } from 'sections';
import { Summary, Library, Page, PostEditor } from 'components';
import { LoginPage } from '../sections/login/login';
import { useAuth } from '../contexts/auth-context';
import {
  useNavigation,
  useBookmarks,
  useBooksStats,
  useBooks,
  useReviews,
} from '../hooks';

export const AppContent = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const { data: apiBooks = [], isPending: isLoading } = useBooks();
  const { data: reviews = [] } = useReviews();
  const { bookmarks, setBookmarks } = useBookmarks();

  const {
    activeNavFromRoute,
    activeCategory,
    summaryBook,
    handleCategoryChange,
    handleNavChange,
    handleBookSelect,
    handleCategorySelect,
    handleSummaryBack,
  } = useNavigation(apiBooks);

  const {
    allBooks,
    popular,
    releases,
    categories,
    favoritesBooks,
    bookOfTheDayData,
  } = useBooksStats(apiBooks, reviews, bookmarks);

  const handleSavePost = (
    data: Omit<Post, 'id' | 'createdAt'>,
    status: PostStatus,
  ) => {
    console.log('Post saved:', { ...data, status });
  };

  const handleBookmark = (id: number) => {
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        !!target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if (isTypingTarget) return;

      const isShiftL = event.shiftKey && event.key.toLowerCase() === 'l';
      const hasModifier = event.metaKey || event.ctrlKey;

      if (isShiftL && hasModifier) {
        event.preventDefault();
        navigate('/login');
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [navigate]);

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
              activeCategory="All"
              bookOfTheDayData={bookOfTheDayData}
              categories={categories}
              isLoading={isLoading}
              onCategoryChange={handleCategorySelect}
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
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
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
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              onBookSelect={handleBookSelect}
              onBookmark={handleBookmark}
            />
          }
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
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/books/:bookId/summary"
          element={
            summaryBook ? (
              <Summary
                book={summaryBook}
                reviews={reviews}
                onBack={handleSummaryBack}
                onBookmark={handleBookmark}
                onCategorySelect={handleCategorySelect}
              />
            ) : isLoading ? null : (
              <Navigate to="/library" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Page>
  );
};
