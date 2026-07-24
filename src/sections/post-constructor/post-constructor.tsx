import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiCreateBook } from 'api';
import { PRESET_BG_COLORS, PRESET_TEXT_COLORS } from '../../constants';
import { track } from '../../lib';
import { useCategories } from '../../hooks';
import { useAuth } from '../../contexts/auth-context';
import {
  FormField,
  Button,
  ImageUpload,
  RichTextEditor,
  CoverConstructor,
  Select,
  SelectOption,
} from '../../components';
import styles from './post-constructor.module.scss';

type FormState = {
  title: string;
  author: string;
  published: string;
  pages: string;
  language: string;
  categories: string[];
  description: string;
  image: string;
  coverColor: string;
  coverTextColor: string;
};

const pick = <T,>(list: T[]): T =>
  list[Math.floor(Math.random() * list.length)];

const makeInitial = (): FormState => ({
  title: '',
  author: '',
  published: '',
  pages: '',
  language: '',
  categories: [],
  description: '',
  image: '',
  coverColor: pick(PRESET_BG_COLORS),
  coverTextColor: pick(PRESET_TEXT_COLORS),
});

export const PostConstructor = () => {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const { data: categories = [] } = useCategories();

  const [form, setForm] = useState<FormState>(makeInitial);
  const [submitted, setSubmitted] = useState(false);

  const categoryOptions: SelectOption[] = categories.map((c) => ({
    value: c.name,
    label: c.name,
  }));

  const handleCategoriesChange = (
    value: SelectOption['value'] | SelectOption['value'][] | null,
  ) => {
    let next: string[] = [];

    if (Array.isArray(value)) {
      next = value.map(String);
    } else if (value != null) {
      next = [String(value)];
    }

    setForm((prev) => ({ ...prev, categories: next }));
  };

  const mutation = useMutation({
    mutationFn: () =>
      apiCreateBook({
        title: form.title.trim(),
        author: form.author.trim(),
        published: form.published ? `${form.published}-01-01` : null,
        pages: form.pages ? Number(form.pages) : null,
        language: form.language.trim() || null,
        categories: form.categories,
        description: form.description ? { en: form.description } : null,
        cover_color: form.coverColor,
        cover_text_color: form.coverTextColor,
        cover_image: form.image || null,
      }),
    onSuccess: () => {
      track('add_book', { title: form.title.trim() });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      setSubmitted(true);
    },
  });

  const set =
    (field: keyof FormState) =>
    (value: string): void =>
      setForm((prev) => ({ ...prev, [field]: value }));

  if (!isAdmin) {
    return (
      <div className={styles.accessDenied} data-testid="access-denied">
        <div className={styles.lockIcon} aria-hidden="true">
          🔒
        </div>
        <h2 className={styles.accessTitle}>Access Denied</h2>
        <p className={styles.accessText}>
          This page is only available for administrators.
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className={styles.success} data-testid="success-message">
        <div className={styles.successIcon} aria-hidden="true">
          ✓
        </div>
        <h2 className={styles.successTitle}>Book Added!</h2>
        <p className={styles.successText}>
          The book has been successfully added to the catalog.
        </p>
        <Button
          onClick={() => {
            setForm(makeInitial());
            setSubmitted(false);
          }}
        >
          Add Another
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Add Book</h1>
        <p className={styles.subtitle}>
          Fill in the details to add a new book to the catalog
        </p>
      </div>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          if (form.title.trim() && form.author.trim()) {
            mutation.mutate();
          }
        }}
        aria-label="Add book form"
      >
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Book Info</h2>
          <div className={styles.grid}>
            <FormField
              label="Title"
              id="title"
              value={form.title}
              onChange={set('title')}
              placeholder="Enter book title"
              required
            />
            <FormField
              label="Author"
              id="author"
              value={form.author}
              onChange={set('author')}
              placeholder="First and last name"
              required
            />
            <FormField
              label="Year of Publication"
              id="published"
              type="number"
              value={form.published}
              onChange={set('published')}
              placeholder="2024"
              hint="Year the book was first published"
            />
            <FormField
              label="Pages"
              id="pages"
              type="number"
              value={form.pages}
              onChange={set('pages')}
              placeholder="350"
            />
            <FormField
              label="Language"
              id="language"
              value={form.language}
              onChange={set('language')}
              placeholder="English"
            />
            <Select
              label="Categories"
              options={categoryOptions}
              value={form.categories}
              placeholder="Select categories..."
              multiple
              onChange={handleCategoriesChange}
            />
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Description</h2>
          <RichTextEditor
            label="What I think"
            placeholder="Write a compelling description..."
            onChange={set('description')}
          />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Cover Image</h2>
          <ImageUpload
            label="Upload Cover Image"
            value={form.image || undefined}
            onChange={set('image')}
            onRemove={() => set('image')('')}
          />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Cover Constructor</h2>
          <p className={styles.sectionSubtitle}>
            Design a generated cover for when no image is available
          </p>
          <CoverConstructor
            coverColor={form.coverColor}
            coverTextColor={form.coverTextColor}
            onCoverColorChange={set('coverColor')}
            onTextColorChange={set('coverTextColor')}
            previewTitle={form.title}
            previewAuthor={form.author}
            previewImage={form.image}
          />
        </section>

        {mutation.isError && (
          <p role="alert" className={styles.subtitle}>
            Could not add the book. Please check the fields and try again.
          </p>
        )}
        <div className={styles.actions}>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setForm(makeInitial())}
          >
            Reset
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={mutation.isPending}
          >
            Publish
          </Button>
        </div>
      </form>
    </div>
  );
};
