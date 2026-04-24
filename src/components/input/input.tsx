import { forwardRef } from 'react';
import cn from 'classnames';
import styles from './input.module.scss';

type InputProps = {
  id?: string;
  type?: 'text' | 'number' | 'email' | 'url' | 'password' | 'search';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  autoFocus?: boolean;
  'aria-required'?: boolean;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      type = 'text',
      value,
      onChange,
      placeholder,
      required,
      className,
      autoFocus,
      ...ariaProps
    },
    ref,
  ) => (
    <input
      ref={ref}
      id={id}
      type={type}
      className={cn(styles.input, className)}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      autoFocus={autoFocus}
      {...ariaProps}
    />
  ),
);

Input.displayName = 'Input';
