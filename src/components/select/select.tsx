import { useState, useRef, useEffect, useCallback } from 'react';
import cn from 'classnames';
import { SearchIcon, ChevronDownIcon } from '../../icons';
import styles from './select.module.scss';

export type SelectOption = {
  value: string | number;
  label: string;
  sublabel?: string;
  color?: string;
};

type SelectProps = {
  options: SelectOption[];
  value: SelectOption['value'] | SelectOption['value'][] | null;
  label?: string;
  placeholder?: string;
  multiple?: boolean;
  onChange: (
    value: SelectOption['value'] | SelectOption['value'][] | null,
  ) => void;
};

const ITEM_HEIGHT = 52;
const VISIBLE_COUNT = 5;
const BUFFER = 2;

export const Select = ({
  options,
  value,
  label,
  placeholder = 'Select...',
  multiple = false,
  onChange,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [scrollTop, setScrollTop] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const toSelectedValues = () => {
    if (Array.isArray(value)) {
      return value;
    }
    if (value !== null) {
      return [value];
    }
    return [];
  };

  const selectedValues = toSelectedValues();

  const filtered = query.trim()
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(query.toLowerCase()) ||
          o.sublabel?.toLowerCase().includes(query.toLowerCase()),
      )
    : options;

  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER);
  const endIndex = Math.min(
    filtered.length,
    startIndex + VISIBLE_COUNT + BUFFER * 2,
  );
  const paddingTop = startIndex * ITEM_HEIGHT;
  const paddingBottom = Math.max(0, (filtered.length - endIndex) * ITEM_HEIGHT);

  const open = () => {
    setIsOpen(true);
    setQuery('');
    setScrollTop(0);
    setTimeout(() => searchRef.current?.focus(), 0);
  };

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  const toggle = (optValue: SelectOption['value']) => {
    if (!multiple) {
      onChange(optValue === value ? null : optValue);
      close();
      return;
    }
    const next = selectedValues.includes(optValue)
      ? selectedValues.filter((v) => v !== optValue)
      : [...selectedValues, optValue];
    onChange(next.length ? next : null);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const onPointer = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        close();
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    document.addEventListener('pointerdown', onPointer);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, close]);

  const renderTriggerContent = () => {
    if (!selectedValues.length) {
      return <span className={styles.placeholder}>{placeholder}</span>;
    }
    if (multiple) {
      const labels = selectedValues
        .map((v) => options.find((o) => o.value === v)?.label)
        .filter(Boolean);
      return (
        <span className={styles.multiValue}>
          {labels.map((l) => (
            <span key={l} className={styles.chip}>
              {l}
            </span>
          ))}
        </span>
      );
    }
    const opt = options.find((o) => o.value === selectedValues[0]);
    return opt ? (
      <span className={styles.singleValue}>
        {opt.color && (
          <span className={styles.dot} style={{ backgroundColor: opt.color }} />
        )}
        <span className={styles.singleLabel}>{opt.label}</span>
        {opt.sublabel && (
          <span className={styles.singleSublabel}>{opt.sublabel}</span>
        )}
      </span>
    ) : null;
  };

  return (
    <div className={styles.wrap} ref={containerRef}>
      {label && <span className={styles.label}>{label}</span>}

      <button
        type="button"
        className={cn(styles.trigger, {
          [styles.open]: isOpen,
        })}
        onClick={isOpen ? close : open}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={styles.triggerInner}>{renderTriggerContent()}</span>
        <ChevronDownIcon
          size={16}
          className={cn(styles.arrow, {
            [styles.arrowOpen]: isOpen,
          })}
        />
      </button>

      {isOpen && (
        <div
          className={styles.dropdown}
          role="listbox"
          aria-multiselectable={multiple}
        >
          <div className={styles.searchRow}>
            <SearchIcon size={15} className={styles.searchIcon} />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setScrollTop(0);
                listRef.current?.scrollTo(0, 0);
              }}
              placeholder="Search..."
              className={styles.searchInput}
            />
          </div>

          <div
            ref={listRef}
            className={styles.list}
            onScroll={(e) =>
              setScrollTop((e.target as HTMLDivElement).scrollTop)
            }
          >
            <div style={{ paddingTop, paddingBottom }}>
              {!multiple && startIndex === 0 && (
                <button
                  type="button"
                  className={cn(styles.item, {
                    [styles.itemActive]: !selectedValues.length,
                  })}
                  onClick={() => {
                    onChange(null);
                    close();
                  }}
                  role="option"
                  aria-selected={!selectedValues.length}
                >
                  <span className={styles.noneLabel}>— {placeholder} —</span>
                </button>
              )}

              {filtered.slice(startIndex, endIndex).map((opt) => {
                const isSelected = selectedValues.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={cn(styles.item, {
                      [styles.itemActive]: isSelected,
                    })}
                    onClick={() => toggle(opt.value)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {opt.color && (
                      <span
                        className={styles.dot}
                        style={{ backgroundColor: opt.color }}
                      />
                    )}
                    <span className={styles.itemContent}>
                      <span className={styles.itemLabel}>{opt.label}</span>
                      {opt.sublabel && (
                        <span className={styles.itemSublabel}>
                          {opt.sublabel}
                        </span>
                      )}
                    </span>
                    {multiple && isSelected && (
                      <span className={styles.check}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <p className={styles.empty}>Nothing found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
