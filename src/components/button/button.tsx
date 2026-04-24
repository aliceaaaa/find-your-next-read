import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import cn from 'classnames';
import styles from './button.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = '',
  ...rest
}: ButtonProps) => {
  const classes = cn(
    styles.btn,
    styles[variant],
    styles[size],
    {
      [styles.full]: fullWidth,
      [styles.loading]: loading,
    },
    className,
  );

  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {loading && (
        <span
          className={styles.spinner}
          aria-hidden="true"
          data-testid="spinner"
        />
      )}
      {!loading && leftIcon && <span className={styles.icon}>{leftIcon}</span>}

      <span className={styles.label}>{children}</span>

      {!loading && rightIcon && (
        <span className={styles.icon}>{rightIcon}</span>
      )}
    </button>
  );
};
