import { MouseEventHandler } from 'react';
import cn from 'classnames';
import { BookmarkIcon } from '../../icons';
import styles from './bookmark-button.module.scss';

type BookmarkButtonProps = {
  isBookmarked?: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  size?: number;
  className?: string;
  iconClassName?: string;
  activeIconClassName?: string;
  ariaLabel?: string;
  ariaLabelBookmarked?: string;
  ariaLabelNotBookmarked?: string;
};

export const BookmarkButton = ({
  isBookmarked,
  onClick,
  size = 20,
  className,
  iconClassName,
  activeIconClassName,
  ariaLabel,
  ariaLabelBookmarked,
  ariaLabelNotBookmarked,
}: BookmarkButtonProps) => {
  const computedAriaLabel =
    ariaLabel ||
    (isBookmarked
      ? ariaLabelBookmarked || 'Remove bookmark'
      : ariaLabelNotBookmarked || 'Add bookmark');

  return (
    <button
      className={cn(styles.button, className)}
      onClick={onClick}
      aria-label={computedAriaLabel}
    >
      <BookmarkIcon
        size={size}
        className={cn(
          styles.icon,
          iconClassName,
          isBookmarked && styles.iconActive,
          isBookmarked && activeIconClassName,
        )}
      />
    </button>
  );
};
