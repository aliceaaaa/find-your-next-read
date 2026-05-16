import cn from 'classnames';
import styles from './form-field.module.scss';

type FormFieldProps = {
  error?: string;
  hint?: string;
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'number' | 'email' | 'url' | 'password';
  value: string;
  onChange: (value: string) => void;
};

export const FormField = ({
  error,
  hint,
  id,
  label,
  placeholder,
  required,
  type = 'text',
  value,
  onChange,
}: FormFieldProps) => (
  <div className={styles.field}>
    <label className={styles.label} htmlFor={id}>
      {label}
      {required && (
        <span className={styles.required} aria-hidden="true">
          *
        </span>
      )}
    </label>
    <input
      id={id}
      type={type}
      className={cn(styles.input, {
        [styles['input--error']]: Boolean(error),
      })}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-required={required}
      aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
      aria-invalid={error ? true : undefined}
    />
    {error && (
      <span id={`${id}-error`} className={styles.errorMsg} role="alert">
        {error}
      </span>
    )}
    {!error && hint && (
      <span id={`${id}-hint`} className={styles.hint}>
        {hint}
      </span>
    )}
  </div>
);
