import { useEffect } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { Book } from 'types';
import { HomeFeed, SearchResults, StaticPage, PostConstructor } from 'sections';
import { getStaticPageMeta } from '../sections/static-page';
import { Summary, Library, Page } from 'components';
import { setDocumentMeta, trackPageView } from '../lib';
import { LoginPage } from '../sections/login/login';
import { useAuth } from '../contexts/auth-context';
import {
  useNavigation,
  useBookmarks,
  useBooksStats,
  useBooks,
  useCategories,
  useReviews,
} from '../hooks';

const getNextBooks = (allBooks: Book[], current: Book, limit = 6): Book[] => {
  const others = allBooks.filter((b) => b.id !== current.id);

  const sameCategory = others.filter((b) =>
    b.categories.some((c) => current.categories.includes(c)),
  );

  const rest = others.filter((b) => !sameCategory.includes(b));

  return [...sameCategory, ...rest].slice(0, limit);
};

export const AppContent = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  const { allBooks, popular, releases, favoritesBooks, bookOfTheDayData } =
    useBooksStats(apiBooks, reviews, bookmarks);

  const { data: apiCategories = [] } = useCategories();
  const categories = [
    'All',
    ...apiCategories.filter((c) => c.booksCount > 0).map((c) => c.name),
  ];

  const handleBookmark = (id: number) => {
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSearch = (query: string) => {
    const trimmed = query.trim();

    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  useEffect(() => {
    const { pathname, search } = location;
    trackPageView(pathname);

    if (pathname === '/') {
      setDocumentMeta({
        description:
          'Discover your next favourite book — browse, search and save reads.',
      });
    } else if (pathname === '/library') {
      setDocumentMeta({
        title: 'Library',
        description: 'Browse the full catalogue of books.',
      });
    } else if (pathname === '/favorites') {
      setDocumentMeta({
        title: 'Favorites',
        description: 'The books you saved to read next.',
      });
    } else if (pathname === '/search') {
      const q = new URLSearchParams(search).get('q') ?? '';
      setDocumentMeta({
        title: q ? `Search: ${q}` : 'Search',
        description: 'Search books by title, author or genre.',
      });
    } else if (pathname === '/create-post') {
      setDocumentMeta({
        title: 'Add Book',
        description: 'Add a new book to the catalogue.',
      });
    } else if (pathname === '/login') {
      setDocumentMeta({ title: 'Log in' });
    } else if (pathname.startsWith('/books/') && summaryBook) {
      setDocumentMeta({
        title: summaryBook.title,
        description: summaryBook.description?.slice(0, 160) || undefined,
      });
    } else if (pathname.startsWith('/pages/')) {
      const meta = getStaticPageMeta(pathname.split('/')[2] ?? '');
      setDocumentMeta({
        title: meta?.title ?? 'Page',
        description: meta?.description,
      });
    } else {
      setDocumentMeta({});
    }
  }, [location, summaryBook]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        !!target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if (isTypingTarget) {
        return;
      }

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

  const renderBookSummary = () => {
    if (summaryBook) {
      return (
        <Summary
          book={summaryBook}
          reviews={reviews}
          nextBooks={getNextBooks(allBooks, summaryBook)}
          onBack={handleSummaryBack}
          onBookmark={handleBookmark}
          onBookSelect={handleBookSelect}
          onCategorySelect={handleCategorySelect}
        />
      );
    }

    if (isLoading) {
      return null;
    }

    return <Navigate to="/library" replace />;
  };

  return (
    <Page
      activeNav={activeNavFromRoute}
      isAdmin={isAdmin}
      onNavChange={handleNavChange}
      onSearch={handleSearch}
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
        <Route path="/create-post" element={<PostConstructor />} />
        <Route
          path="/search"
          element={
            <SearchResults
              bookmarks={bookmarks}
              onBookSelect={handleBookSelect}
              onBookmark={handleBookmark}
            />
          }
        />
        <Route path="/pages/:slug" element={<StaticPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/books/:bookId/summary" element={renderBookSummary()} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Page>
  );
};
