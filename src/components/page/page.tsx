import { ReactNode, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { NavItemId } from 'types';
import { Menu } from '../menu';
import { SearchBar } from '../search-bar';
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
  const isSearchOpen = activeNav === 'search';
  const [showOverlay, setShowOverlay] = useState(isSearchOpen);
  const [isClosing, setIsClosing] = useState(false);
  const prevNavRef = useRef<NavItemId>('home');

  useEffect(() => {
    if (!isSearchOpen) {
      prevNavRef.current = activeNav;
    }
  }, [activeNav, isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setShowOverlay(true);
      setIsClosing(false);
    } else if (showOverlay) {
      setIsClosing(true);
    }
  }, [isSearchOpen, showOverlay]);

  const handleClose = () => {
    onNavChange(prevNavRef.current);
  };

  const handleAnimationEnd = () => {
    if (isClosing) {
      setShowOverlay(false);
      setIsClosing(false);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        handleClose();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isSearchOpen]);

  return (
    <div className={styles.page}>
      <Menu activeNav={activeNav} isAdmin={isAdmin} onNavChange={onNavChange} />
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Find your next read</h1>
          <SearchBar
            onSearch={onSearch}
            className={cn(styles.search, {
              [styles.searchHidden]: isSearchOpen,
            })}
          />
        </header>
        <div className={styles.body}>
          <main className={styles.main}> {children}</main>
          {rightPanel && <aside className={styles.aside}> {rightPanel}</aside>}
        </div>
      </div>
      {showOverlay && (
        <div
          className={cn(styles.overlay, {
            [styles.closing]: isClosing,
          })}
          onClick={handleClose}
          onAnimationEnd={handleAnimationEnd}
        >
          <button
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="Close search"
          >
            ✕
          </button>
          <div
            className={styles.overlaySearch}
            onClick={(e) => e.stopPropagation()}
          >
            <SearchBar autoFocus onSearch={onSearch} />
          </div>
        </div>
      )}
    </div>
  );
};
