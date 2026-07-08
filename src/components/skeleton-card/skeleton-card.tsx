import styles from './skeleton-card.module.scss';

export const SkeletonCard = () => (
  <div className={styles.skeletonCard}>
    <div className={styles.skeletonCover} />
    <div className={styles.skeletonTitle} />
    <div className={styles.skeletonAuthor} />
    <div className={styles.skeletonRating} />
  </div>
);
