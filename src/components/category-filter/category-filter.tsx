import cn from 'classnames';
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
}: CategoryFilterProps) => (
  <div className={styles['category-filter']}>
    <div className={styles.header}>
      <h2>Categories</h2>
    </div>
    <div className={styles.list}>
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
  </div>
);
