import { useRef } from 'react';
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

  const scroll = () => {
    scrollRef.current?.scrollBy({ left: 150, behavior: 'smooth' });
  };

  return (
    <div className={styles['category-filter']}>
      <div className={styles.header}>
        <h2>Categories</h2>
      </div>
      <div className={styles['scroll-wrap']}>
        <div className={styles.list} ref={scrollRef}>
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
          <button className={styles['view-all']}>View all</button>
        </div>
        <button
          className={styles['arrow-btn']}
          onClick={scroll}
          aria-label="Scroll right"
        >
          <ChevronRightIcon size={16} />
        </button>
      </div>
    </div>
  );
};
