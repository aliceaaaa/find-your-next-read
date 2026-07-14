import {
  useNavigate,
  useLocation,
  useMatch,
  useSearchParams,
} from 'react-router-dom';
import { navFromPath, navPathMap } from '../constants';
import type { Book, NavItemId } from 'types';

export const useNavigation = (apiBooks: Book[]) => {
  const navigate = useNavigate();
  const location = useLocation();
  const summaryMatch = useMatch('/books/:bookId/summary');
  const [searchParams, setSearchParams] = useSearchParams();

  const locationState = location.state as { from?: string } | null;

  const summaryBook = summaryMatch?.params.bookId
    ? apiBooks.find((book) => book.id === Number(summaryMatch.params.bookId)) ||
      null
    : null;

  const activeNavFromRoute = location.pathname.startsWith('/books/')
    ? navFromPath(locationState?.from || '/library')
    : navFromPath(location.pathname);

  const activeCategory = searchParams.get('category') || 'All';

  const handleCategoryChange = (category: string) => {
    setSearchParams(category === 'All' ? {} : { category }, { replace: true });
  };

  const handleNavChange = (id: NavItemId) => {
    navigate(navPathMap[id]);
  };

  const handleBookSelect = (book: Book) => {
    navigate(`/books/${book.id}/summary`, {
      state: { from: location.pathname },
    });
  };

  const handleCategorySelect = (category: string) => {
    navigate(
      category === 'All'
        ? '/library'
        : `/library?category=${encodeURIComponent(category)}`,
    );
  };

  const handleSummaryBack = () => {
    navigate(locationState?.from || '/library');
  };

  return {
    activeNavFromRoute,
    activeCategory,
    summaryBook,
    handleCategoryChange,
    handleNavChange,
    handleBookSelect,
    handleCategorySelect,
    handleSummaryBack,
  };
};
