import { SkeletonCard } from '../skeleton-card';
import { BookShelfCardType } from './book-shelf';

import styles from './book-shelf.module.scss';

type LoaderProps = {
  cardType: BookShelfCardType;
  count: number;
};

export const Loader = ({ cardType, count }: LoaderProps) => (
  <>
    {Array.from({ length: count }).map((_, i) =>
      cardType === 'full' ? (
        <SkeletonCard key={i} />
      ) : (
        <div className={styles.skeletonMiniCard} key={i} />
      ),
    )}
  </>
);
