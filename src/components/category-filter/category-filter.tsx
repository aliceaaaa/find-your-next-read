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

  const categoriesKey = categories.join('\n');

  useEffect(() => {
    const list = scrollRef.current;
    const activePill = list?.querySelector<HTMLButtonElement>(
      `.${styles.active}`,
    );

    if (!list || !activePill) {
      return;
    }

    const pillBox = activePill.getBoundingClientRect();
    const listBox = list.getBoundingClientRect();
    const left = pillBox.left - listBox.left + list.scrollLeft;
    const right = left + pillBox.width;

    if (left < list.scrollLeft) {
      list.scrollTo?.({ left });
    } else if (right > list.scrollLeft + list.clientWidth) {
      list.scrollTo?.({ left: right - list.clientWidth });
    }
  }, [active, categoriesKey]);

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
