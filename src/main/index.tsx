import { useEffect } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
  useParams,
} from 'react-router-dom';
import { Book } from 'types';
import {
  HomeFeed,
  NotFound,
  SearchResults,
  StaticPage,
  PostConstructor,
  ReviewsPage,
  ConnectionsPage,
  WhoWeArePage,
} from 'sections';
import { getStaticPageMeta } from '../sections/static-page';
import { Summary, Library, Page } from 'components';
import { normalizePathname } from '../constants';
import pageMeta from '../constants/page-meta.json';
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

const NOT_FOUND_META = { title: 'Page not found', noindex: true };

const getReadingOrder = (allBooks: Book[], current: Book) => {
  const byId = new Map(allBooks.map((b) => [b.id, b]));

  return {
    readNext: (current.nextBookIds ?? [])
      .map((id) => byId.get(id))
      .filter((b): b is Book => !!b),
    readBefore: allBooks.filter((b) => b.nextBookIds?.includes(current.id)),
  };
};

const getNextBooks = (
  allBooks: Book[],
  current: Book,
  exclude: Book[] = [],
  limit = 12,
): Book[] => {
  const others = allBooks.filter(
    (b) => b.id !== current.id && !exclude.some((e) => e.id === b.id),
  );

  const sameCategory = others.filter((b) =>
    b.categories.some((c) => current.categories.includes(c)),
  );

  const rest = others.filter((b) => !sameCategory.includes(b));

  return [...sameCategory, ...rest].slice(0, limit);
};

const EditBookRoute = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const id = Number(bookId);

  if (!Number.isFinite(id)) {
    return <Navigate to="/library/" replace />;
  }

  return (
    <PostConstructor
      key={id}
      bookId={id}
      onSaved={(savedId) =>
        navigate(`/books/${savedId}/summary/`, { replace: true })
      }
      onDeleted={() => navigate('/library/', { replace: true })}
    />
  );
};

export const AppContent = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data: apiBooks = [],
    isPending: isLoading,
    isError: isBooksError,
  } = useBooks();
  const { data: reviews = [] } = useReviews();
  const { bookmarks, setBookmarks } = useBookmarks();

  const {
    activeNavFromRoute,
    activeCategory,
    summaryBook: routeBook,
    handleCategoryChange,
    handleNavChange,
    handleBookSelect,
    handleCategorySelect,
    handleSummaryBack,
  } = useNavigation(apiBooks);

  const { allBooks, popular, releases, favoritesBooks, bookOfTheDayData } =
    useBooksStats(apiBooks, reviews, bookmarks);

  const summaryBook = routeBook
    ? (allBooks.find((book) => book.id === routeBook.id) ?? routeBook)
    : null;

  const { data: apiCategories = [] } = useCategories();
  const categories = [
    'All',
    ...apiCategories.filter((c) => c.booksCount > 0).map((c) => c.name),
  ];

  const handleBookmark = (id: number) => {
    setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRandomBook = () => {
    const candidates = allBooks.filter((book) => book.id !== summaryBook?.id);

    if (candidates.length > 0) {
      handleBookSelect(
        candidates[Math.floor(Math.random() * candidates.length)],
      );
    }
  };

  const isSearchPage = normalizePathname(location.pathname) === '/search';
  const searchFrom: string = isSearchPage
    ? (location.state as { from?: string } | null)?.from ?? '/'
    : `${location.pathname}${location.search}`;

  const handleSearch = (query: string) => {
    const trimmed = query.trim();

    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`, {
        state: { from: searchFrom },
      });
    } else if (isSearchPage) {
      navigate(searchFrom);
    }
  };

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  useEffect(() => {
    const { pathname, search } = location;
    const path = normalizePathname(pathname);

    if (path === '/') {
      setDocumentMeta({
        description:
          'Find Your Next Read — book reviews written entirely by humans. Discover your next favorite book with personalized recommendations and books similar to the ones you love.',
      });
    } else if (path === '/library') {
      setDocumentMeta(pageMeta.library);
    } else if (path === '/favorites') {
      setDocumentMeta({
        title: 'Favorites',
        description: 'The books you saved to read next.',
        noindex: true,
      });
    } else if (path === '/reviews') {
      const author = new URLSearchParams(search).get('author') ?? '';
      setDocumentMeta({
        title: author ? `Reviews by ${author}` : 'Reviews',
        description:
          'Book reviews written entirely by humans on Find Your Next Read.',
      });
    } else if (path === '/connections') {
      setDocumentMeta({
        title: 'Connections',
        description:
          'Book constellations: how the books on Find Your Next Read connect by genre and reading order.',
      });
    } else if (path === '/search') {
      const q = new URLSearchParams(search).get('q') ?? '';
      setDocumentMeta({
        title: q ? `Search: ${q}` : 'Search',
        description: 'Search books by title, author or genre.',
        noindex: true,
      });
    } else if (path === '/create-post') {
      setDocumentMeta({
        title: 'Add Book',
        description: 'Add a new book to the catalogue.',
        noindex: true,
      });
    } else if (/^\/books\/[^/]+\/edit$/.test(path)) {
      setDocumentMeta({ title: 'Edit Book', noindex: true });
    } else if (path === '/login') {
      setDocumentMeta({ title: 'Log in', noindex: true });
    } else if (path.startsWith('/books/')) {
      if (summaryBook) {
        setDocumentMeta({
          title: summaryBook.author
            ? `${summaryBook.title} by ${summaryBook.author}`
            : summaryBook.title,
          description:
            summaryBook.description?.replace(/\s+/g, ' ').slice(0, 160) ||
            undefined,
        });
      } else if (!isLoading && !isBooksError) {
        setDocumentMeta(NOT_FOUND_META);
      }
    } else if (path.startsWith('/pages/')) {
      const meta = getStaticPageMeta(path.split('/')[2] ?? '');
      setDocumentMeta(
        meta
          ? { title: meta.title, description: meta.description }
          : NOT_FOUND_META,
      );
    } else {
      setDocumentMeta(NOT_FOUND_META);
    }
  }, [location, summaryBook, isLoading, isBooksError]);

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
      const { readNext, readBefore } = getReadingOrder(allBooks, summaryBook);

      return (
        <Summary
          book={summaryBook}
          reviews={reviews}
          readNext={readNext}
          readBefore={readBefore}
          nextBooks={getNextBooks(allBooks, summaryBook, [
            ...readNext,
            ...readBefore,
          ])}
          onBack={handleSummaryBack}
          onEdit={
            isAdmin
              ? () => navigate(`/books/${summaryBook.id}/edit`)
              : undefined
          }
          onBookmark={handleBookmark}
          onBookSelect={handleBookSelect}
          onCategorySelect={handleCategorySelect}
        />
      );
    }

    if (isLoading) {
      return null;
    }

    return isBooksError ? <Navigate to="/library/" replace /> : <NotFound />;
  };

  return (
    <Page
      activeNav={activeNavFromRoute}
      isAdmin={isAdmin}
      onNavChange={handleNavChange}
      onRandomBook={allBooks.length > 0 ? handleRandomBook : undefined}
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
        <Route
          path="/reviews"
          element={
            <ReviewsPage books={allBooks} onBookSelect={handleBookSelect} />
          }
        />
        <Route
          path="/connections"
          element={
            <ConnectionsPage
              books={allBooks}
              isLoading={isLoading}
              canEdit={isAdmin}
              onBookSelect={handleBookSelect}
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
        <Route path="/pages/who-we-are" element={<WhoWeArePage />} />
        <Route path="/pages/:slug" element={<StaticPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/books/:bookId/summary" element={renderBookSummary()} />
        <Route path="/books/:bookId/edit" element={<EditBookRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Page>
  );
};
