import { useEffect, useState } from 'react';
import { Book } from 'types';
import { ApiError, ApiBookPayload } from 'api';
import { useBook } from '../../hooks/use-book';
import {
  useAttachNextBooks,
  useDetachNextBook,
} from '../../hooks/use-next-book-mutations';
import { useCreateBook, useUpdateBook } from '../../hooks/use-book-mutations';
import { FormField } from '../form-field';
import { Select, SelectOption } from '../select';
import { CoverConstructor } from '../cover-constructor';
import { Button } from '../button';
import { PRESET_BG_COLORS, PRESET_TEXT_COLORS, LANGUAGES, GENRES } from '../../constants';
import styles from './book-editor.module.scss';

type BookEditorProps = {
  bookId?: number;
  allBooks: Book[];
  onSaved: (id: number) => void;
  onCancel: () => void;
};

const parseDescription = (
  text: string,
): { value?: Record<string, unknown>; error?: string } => {
  const trimmed = text.trim();
  if (!trimmed) return { value: {} };
  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return { error: 'Description must be a JSON object, e.g. { "en": "..." }' };
    }
    return { value: parsed as Record<string, unknown> };
  } catch {
    return { error: 'Invalid JSON' };
  }
};

const pickRandom = (arr: readonly string[]): string =>
  arr[Math.floor(Math.random() * arr.length)];

export const BookEditor = ({
  bookId,
  allBooks,
  onSaved,
  onCancel,
}: BookEditorProps) => {
  const isEdit = typeof bookId === 'number';
  const { data: existing } = useBook(bookId ?? null);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [pages, setPages] = useState('');
  const [language, setLanguage] = useState('en');
  const [published, setPublished] = useState('');
  const [description, setDescription] = useState('');
  const [coverColor, setCoverColor] = useState(() =>
    isEdit ? PRESET_BG_COLORS[0] : pickRandom(PRESET_BG_COLORS),
  );
  const [coverTextColor, setCoverTextColor] = useState(() =>
    isEdit ? PRESET_TEXT_COLORS[0] : pickRandom(PRESET_TEXT_COLORS),
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [nextBookIds, setNextBookIds] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isEdit || !existing) return;
    setTitle(existing.title);
    setAuthor(existing.author);
    setIsbn(existing.isbn ?? '');
    setPages(existing.pages ? String(existing.pages) : '');
    setLanguage(existing.language || 'en');
    setPublished(existing.publishedDate ? existing.publishedDate.slice(0, 10) : '');
    setDescription(
      existing.descriptionRaw
        ? JSON.stringify(existing.descriptionRaw, null, 2)
        : '',
    );
    setCoverColor(existing.coverColor);
    setCoverTextColor(existing.coverTextColor);
    setSelectedCategories(existing.categories);
    setNextBookIds(existing.nextBookIds ?? []);
  }, [isEdit, existing]);

  const createBook = useCreateBook();
  const updateBook = useUpdateBook();
  const attachNextBooks = useAttachNextBooks();
  const detachNextBook = useDetachNextBook();

  const submitting =
    createBook.isPending ||
    updateBook.isPending ||
    attachNextBooks.isPending ||
    detachNextBook.isPending;

  const categoryOptions: SelectOption[] = Array.from(
    new Set([
      ...GENRES,
      ...selectedCategories.filter((c) => c && c !== 'All'),
    ]),
  ).map((c) => ({ value: c, label: c }));

  const nextBookOptions: SelectOption[] = allBooks
    .filter((b) => b.id !== bookId)
    .map((b) => ({
      value: b.id,
      label: b.title,
      sublabel: b.author,
      color: b.coverColor,
    }));

  const handleCategoryChange = (
    value: SelectOption['value'] | SelectOption['value'][] | null,
  ) => {
    setSelectedCategories(
      Array.isArray(value) ? value.map(String) : value ? [String(value)] : [],
    );
  };

  const handleNextBookChange = (
    value: SelectOption['value'] | SelectOption['value'][] | null,
  ) => {
    setNextBookIds(
      Array.isArray(value)
        ? value.map(Number)
        : value
          ? [Number(value)]
          : [],
    );
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = 'Title is required';
    if (!author.trim()) next.author = 'Author is required';
    const desc = parseDescription(description);
    if (desc.error) next.description = desc.error;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildPayload = (): ApiBookPayload => ({
    title: title.trim(),
    author: author.trim(),
    cover_color: coverColor,
    cover_text_color: coverTextColor,
    categories: selectedCategories,
    description: parseDescription(description).value ?? {},
    published: published ? new Date(published).toISOString() : null,
    pages: pages ? Number(pages) : null,
    language: language || null,
    isbn: isbn.trim() || null,
  });

  const applyValidationErrors = (err: unknown) => {
    if (err instanceof ApiError && err.errors) {
      const mapped: Record<string, string> = {};
      Object.entries(err.errors).forEach(([field, msgs]) => {
        mapped[field] = Array.isArray(msgs) ? msgs[0] : String(msgs);
      });
      setErrors((prev) => ({ ...prev, ...mapped }));
    }
  };

  const syncNextBooks = async (id: number, before: number[]) => {
    const after = nextBookIds;
    const toAdd = after.filter((x) => !before.includes(x));
    const toRemove = before.filter((x) => !after.includes(x));
    if (toAdd.length) {
      await attachNextBooks.mutateAsync({ id, nextBookIds: toAdd });
    }
    for (const removed of toRemove) {
      await detachNextBook.mutateAsync({ id, nextBookId: removed });
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setErrors({});
    const payload = buildPayload();
    const before = existing?.nextBookIds ?? [];

    try {
      let savedId: number;
      if (isEdit && bookId) {
        const updated = await updateBook.mutateAsync({ id: bookId, payload });
        savedId = updated.id;
      } else {
        const created = await createBook.mutateAsync(payload);
        savedId = created.id;
      }
      await syncNextBooks(savedId, before);
      onSaved(savedId);
    } catch (err) {
      applyValidationErrors(err);
    }
  };

  return (
    <div className={styles.editor}>
      <div className={styles.topBar}>
        <h2 className={styles.heading}>
          {isEdit ? 'Edit book' : 'New book'}
        </h2>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
          <Button onClick={handleSubmit} loading={submitting}>
            {isEdit ? 'Save changes' : 'Create book'}
          </Button>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.form}>
          <FormField
            id="book-title"
            label="Title"
            placeholder="Book title"
            required
            value={title}
            onChange={setTitle}
            error={errors.title}
          />
          <FormField
            id="book-author"
            label="Author"
            placeholder="Author name"
            required
            value={author}
            onChange={setAuthor}
            error={errors.author}
          />
          <div className={styles.row}>
            <FormField
              id="book-isbn"
              label="ISBN"
              placeholder="978..."
              value={isbn}
              onChange={setIsbn}
              error={errors.isbn}
            />
            <FormField
              id="book-pages"
              label="Pages"
              type="number"
              placeholder="0"
              value={pages}
              onChange={setPages}
            />
          </div>
          <div className={styles.row}>
            <Select
              label="Language"
              options={LANGUAGES.map((l) => ({ value: l.code, label: l.name }))}
              value={language}
              placeholder="Select language..."
              onChange={(v) =>
                setLanguage(typeof v === 'string' ? v : 'en')
              }
            />
            <div className={styles.field}>
              <label className={styles.label} htmlFor="book-published">
                Published
              </label>
              <input
                id="book-published"
                type="date"
                className={styles.dateInput}
                value={published}
                onChange={(e) => setPublished(e.target.value)}
              />
            </div>
          </div>

          <Select
            label="Categories"
            options={categoryOptions}
            value={selectedCategories}
            placeholder="Select categories..."
            multiple
            onChange={handleCategoryChange}
          />

          <div className={styles.field}>
            <label className={styles.label} htmlFor="book-description">
              Description
            </label>
            <textarea
              id="book-description"
              className={styles.textarea}
              placeholder='{ "en": "A science fiction novel..." }'
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && (
              <span className={styles.error} role="alert">
                {errors.description}
              </span>
            )}
          </div>

          <Select
            label="Next books"
            options={nextBookOptions}
            value={nextBookIds}
            placeholder="Link related books..."
            multiple
            onChange={handleNextBookChange}
          />
        </div>

        <CoverConstructor
          coverColor={coverColor}
          coverTextColor={coverTextColor}
          previewTitle={title || undefined}
          previewAuthor={author || undefined}
          onCoverColorChange={setCoverColor}
          onTextColorChange={setCoverTextColor}
        />
      </div>
    </div>
  );
};
