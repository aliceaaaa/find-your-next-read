import cn from 'classnames';
import { Cover } from '../cover';
import { Book } from 'types';
import {
  PREVIEW_BASE,
  PRESET_BG_COLORS,
  PRESET_TEXT_COLORS,
  LIGHT_COLORS,
} from '../../constants';

import styles from './cover-constructor.module.scss';

type CoverConstructorProps = {
  coverColor: string;
  coverTextColor: string;
  previewTitle?: string;
  previewAuthor?: string;
  previewImage?: string;
  onCoverColorChange: (color: string) => void;
  onTextColorChange: (color: string) => void;
};

export const CoverConstructor = ({
  coverColor,
  coverTextColor,
  previewTitle,
  previewAuthor,
  previewImage,
  onCoverColorChange,
  onTextColorChange,
}: CoverConstructorProps) => {
  const previewBook: Book = {
    ...PREVIEW_BASE,
    coverColor,
    coverTextColor,
    coverImage: previewImage || null,
    title: previewTitle || 'Book Title',
    author: previewAuthor || 'Author Name',
  };

  return (
    <div className={styles.coverConstructor}>
      <Cover book={previewBook} size="lg" />
      <div className={styles.controls}>
        <div className={styles.group}>
          <div className={styles.groupLabel}>Background Color</div>
          <div
            className={styles.swatches}
            role="group"
            aria-label="Background color swatches"
          >
            {PRESET_BG_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={cn(styles.swatch, {
                  [styles['swatch--active']]: coverColor === color,
                })}
                style={{ backgroundColor: color }}
                onClick={() => onCoverColorChange(color)}
                aria-label={`Background color ${color}`}
                aria-pressed={coverColor === color}
              />
            ))}
          </div>
          <div className={styles.colorPickerRow}>
            <label
              className={styles.colorPickerLabel}
              htmlFor="bg-color-picker"
            >
              Custom color
            </label>
            <input
              id="bg-color-picker"
              type="color"
              value={coverColor}
              onChange={(e) => onCoverColorChange(e.target.value)}
              className={styles.colorPicker}
              aria-label="Custom background color"
            />
            <span className={styles.colorValue}>{coverColor}</span>
          </div>
        </div>
        <div className={styles.group}>
          <div className={styles.groupLabel}>Text Color</div>
          <div
            className={styles.swatches}
            role="group"
            aria-label="Text color swatches"
          >
            {PRESET_TEXT_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={cn(styles.swatch, {
                  [styles['swatch--active']]: coverTextColor === color,
                })}
                style={{
                  backgroundColor: color,
                  border: LIGHT_COLORS.has(color)
                    ? '1px solid #E5E7EB'
                    : undefined,
                }}
                onClick={() => onTextColorChange(color)}
                aria-label={`Text color ${color}`}
                aria-pressed={coverTextColor === color}
              />
            ))}
          </div>
          <div className={styles.colorPickerRow}>
            <label
              className={styles.colorPickerLabel}
              htmlFor="text-color-picker"
            >
              Custom color
            </label>
            <input
              id="text-color-picker"
              type="color"
              value={coverTextColor}
              onChange={(e) => onTextColorChange(e.target.value)}
              className={styles.colorPicker}
              aria-label="Custom text color"
            />
            <span className={styles.colorValue}>{coverTextColor}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
