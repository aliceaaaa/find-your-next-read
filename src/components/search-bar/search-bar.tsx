import { useState, useRef, useEffect, FormEvent } from 'react';
import cn from 'classnames';
import { SearchIcon, XIcon } from '../../icons';
import styles from './search-bar.module.scss';

type SearchBarProps = {
  onSearch?: (query: string) => void;
  value?: string;
  className?: string;
  autoFocus?: boolean;
};

export const SearchBar = ({
  onSearch,
  value,
  className,
  autoFocus,
}: SearchBarProps) => {
  const [query, setQuery] = useState(value ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setQuery(value);
    }
  }, [value]);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const handleChange = (next: string) => {
    setQuery(next);

    if (!next) {
      onSearch?.('');
    }
  };

  const handleClear = () => {
    handleChange('');
    inputRef.current?.focus();
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
            onChange={(e) => handleChange(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className={styles['clear-btn']}
              onClick={handleClear}
              aria-label="Clear search"
            >
              <XIcon size={16} />
            </button>
          )}
        </div>
        <button
          className={styles['submit-btn']}
          type="submit"
          aria-label="Search"
        >
          <SearchIcon size={18} color="white" />
        </button>
      </form>
    </div>
  );
};
