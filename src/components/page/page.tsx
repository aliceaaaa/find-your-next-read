import { ReactNode, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { NavItemId } from 'types';
import { Menu } from '../menu';
import { SearchBar } from '../search-bar';
import { Footer } from '../footer';
import { CookieBanner } from '../cookie-banner';
import styles from './page.module.scss';

type PageProps = {
  activeNav: NavItemId;
  isAdmin?: boolean;
  onNavChange: (id: NavItemId) => void;
  onSearch?: (query: string) => void;
  rightPanel?: ReactNode;
  children: ReactNode;
};

export const Page = ({
  activeNav,
  isAdmin = false,
  onNavChange,
  onSearch,
  rightPanel,
  children,
}: PageProps) => {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    if (content && typeof content.scrollTo === 'function') {
      content.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <>
      <div className={styles.page}>
        <Menu
          activeNav={activeNav}
          isAdmin={isAdmin}
          onNavChange={onNavChange}
        />
        <div className={styles.content} ref={contentRef}>
          <header className={styles.header}>
            <h1 className={styles.title}>
              Find your next <em>read</em>
            </h1>
            <SearchBar onSearch={onSearch} className={styles.search} />
          </header>
          <div className={styles.body}>
            <main className={styles.main}> {children}</main>
            {rightPanel && (
              <aside className={styles.aside}> {rightPanel}</aside>
            )}
          </div>
          <Footer />
        </div>
      </div>
      <CookieBanner />
    </>
  );
};
