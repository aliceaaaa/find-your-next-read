import { useRef, useState, useCallback, ChangeEvent, DragEvent } from 'react';
import cn from 'classnames';
import styles from './image-upload.module.scss';

type ImageUploadProps = {
  accept?: string;
  label?: string;
  value?: string;
  onChange?: (dataUrl: string) => void;
  onRemove?: () => void;
};

export const ImageUpload = ({
  accept = 'image/*',
  label = 'Upload Image',
  value,
  onChange,
  onRemove,
}: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          onChange?.(result);
        }
      };

      reader.readAsDataURL(file);
    },
    [onChange],
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    e.target.value = '';
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className={styles.wrapper}>
      {label && <div className={styles.label}>{label}</div>}
      {value ? (
        <div className={styles.preview}>
          <img src={value} alt="Upload preview" className={styles.img} />
          <button
            type="button"
            className={styles.removeBtn}
            onClick={onRemove}
            aria-label="Remove image"
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          className={cn(styles.dropzone, {
            [styles['dropzone--active']]: isDragging,
          })}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          aria-label="Upload image"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        >
          <svg
            className={styles.dropIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path
              d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="17 8 12 3 7 8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" />
          </svg>
          <p className={styles.dropText}>
            {isDragging ? 'Drop image here' : 'Click or drag image here'}
          </p>
          <p className={styles.dropHint}>PNG, JPG, WEBP up to 10 MB</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className={styles.hiddenInput}
        aria-hidden="true"
        tabIndex={-1}
        data-testid="file-input"
      />
    </div>
  );
};
