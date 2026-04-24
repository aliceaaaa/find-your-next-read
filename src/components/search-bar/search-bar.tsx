import { useState, useRef, useEffect, FormEvent } from 'react';
import cn from 'classnames';
import { SearchIcon } from '../../icons';
import styles from './search-bar.module.scss';

type SearchBarProps = {
  onSearch?: (query: string) => void;
  className?: string;
  autoFocus?: boolean;
};

export const SearchBar = ({
  onSearch,
  className,
  autoFocus,
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <div className={cn(styles['search-bar'], className)}>
      <form onSubmit={handleSubmit}>
        <div className={styles['input-wrap']}>
          <SearchIcon size={18} className={styles['input-icon']} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by title, author, or genre..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button className={styles['submit-btn']} type="submit">
          <SearchIcon size={18} color="white" />
        </button>
      </form>
    </div>
  );
};
