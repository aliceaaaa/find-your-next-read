import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { ChevronRightIcon } from '../../icons';
import styles from './category-filter.module.scss';

type CategoryFilterProps = {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
};

export const CategoryFilter = ({
  categories,
  active,
  onChange,
}: CategoryFilterProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const activePill = scrollRef.current?.querySelector<HTMLButtonElement>(
      `.${styles.active}`,
    );
    activePill?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  }, [active, categories]);

  const scroll = () => {
    scrollRef.current?.scrollBy({ left: 150, behavior: 'smooth' });
  };

  return (
    <div className={styles['category-filter']}>
      <div className={styles.header}>
        <h2>Categories</h2>
        <button
          className={styles['view-all']}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? 'Show less' : 'View all'}
        </button>
      </div>
      <div className={styles['scroll-wrap']}>
        <div
          className={cn(styles.list, { [styles.expanded]: isExpanded })}
          ref={scrollRef}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              className={cn(styles.pill, {
                [styles.active]: active === cat,
              })}
              onClick={() => onChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        {!isExpanded && (
          <button
            className={styles['arrow-btn']}
            onClick={scroll}
            aria-label="Scroll right"
          >
            <ChevronRightIcon size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
