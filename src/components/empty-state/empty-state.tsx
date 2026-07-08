import cn from 'classnames';
import styles from './empty-state.module.scss';

type EmptyStateProps = {
  icon?: string;
  title: string;
  subtitle: string;
  className?: string;
};

export const EmptyState = ({
  icon = '📚',
  title,
  subtitle,
  className,
}: EmptyStateProps) => (
  <div className={cn(styles.empty, className)}>
    <span className={styles.emptyIcon}>{icon}</span>
    <p className={styles.emptyTitle}>{title}</p>
    <p className={styles.emptySubtitle}>{subtitle}</p>
  </div>
);
