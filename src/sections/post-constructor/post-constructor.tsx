import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ApiBook,
  CreateBookPayload,
  apiCreateBook,
  apiDeleteBookCover,
  apiGetBook,
  apiUpdateBook,
  apiUploadBookCover,
  categoryToName,
  descriptionToString,
} from 'api';
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
  isbn: string;
  categories: string[];
  description: string;
  /** Cover preview: the saved cover's URL or a data URL of a picked file. */
  image: string;
  /** A newly picked cover, uploaded after the book is saved. */
  coverFile: File | null;
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
  isbn: '',
  categories: [],
  description: '',
  image: '',
  coverFile: null,
  coverColor: pick(PRESET_BG_COLORS),
  coverTextColor: pick(PRESET_TEXT_COLORS),
});

const fromApiBook = (book: ApiBook): FormState => ({
  title: book.title ?? '',
  author: book.author ?? '',
  published: book.published
    ? String(new Date(book.published).getFullYear())
    : '',
  pages: book.pages ? String(book.pages) : '',
  language: book.language ?? '',
  isbn: book.isbn ?? '',
  categories: (book.categories ?? []).map(categoryToName),
  description: descriptionToString(book.description),
  image: book.cover?.url ?? '',
  coverFile: null,
  coverColor: book.cover_color || pick(PRESET_BG_COLORS),
  coverTextColor: book.cover_text_color || pick(PRESET_TEXT_COLORS),
});

type PostConstructorProps = {
  /** When set, the form loads this book and saves changes to it. */
  bookId?: number;
  onSaved?: (bookId: number) => void;
};

export const PostConstructor = ({ bookId, onSaved }: PostConstructorProps) => {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const { data: categories = [] } = useCategories();
  const isEdit = bookId != null;

  const {
    data: editedBook,
    isPending: isBookLoading,
    isError: isBookError,
  } = useQuery({
    queryKey: ['books', 'raw', bookId],
    queryFn: () => apiGetBook(bookId as number),
    enabled: isEdit && isAdmin,
  });

  const [form, setForm] = useState<FormState>(makeInitial);
  const [formKey, setFormKey] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [coverFailed, setCoverFailed] = useState(false);

  useEffect(() => {
    if (editedBook) {
      setForm(fromApiBook(editedBook));
      setFormKey((k) => k + 1);
    }
  }, [editedBook]);

  const initialDescription = editedBook
    ? descriptionToString(editedBook.description)
    : '';

  const resetForm = () => {
    setForm(editedBook ? fromApiBook(editedBook) : makeInitial());
    setFormKey((k) => k + 1);
    setCoverFailed(false);
  };

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

  const toPublished = (): string | null => {
    if (!form.published) {
      return null;
    }

    // Keep the full original date when the year was not changed.
    if (
      editedBook?.published &&
      String(new Date(editedBook.published).getFullYear()) === form.published
    ) {
      return editedBook.published;
    }

    return `${form.published}-01-01`;
  };

  const mutation = useMutation({
    onMutate: () => setCoverFailed(false),
    mutationFn: async () => {
      const payload: CreateBookPayload = {
        title: form.title.trim(),
        author: form.author.trim(),
        published: toPublished(),
        pages: form.pages ? Number(form.pages) : null,
        language: form.language.trim() || null,
        isbn: form.isbn.trim() || null,
        categories: form.categories,
        description: form.description ? { en: form.description } : null,
        cover_color: form.coverColor,
        cover_text_color: form.coverTextColor,
      };

      const saved =
        bookId != null
          ? await apiUpdateBook(bookId, payload)
          : await apiCreateBook(payload);
      const savedId = saved?.id ?? (bookId as number);

      // The cover has its own endpoint, so it can only go up once the book
      // exists. Its failure is reported apart from the book's: the book is
      // already saved, and publishing again would create a duplicate.
      let coverSaved = true;

      try {
        if (form.coverFile) {
          await apiUploadBookCover(savedId, form.coverFile);
        } else if (!form.image && editedBook?.cover) {
          await apiDeleteBookCover(savedId);
        }
      } catch {
        coverSaved = false;
      }

      return { savedId, coverSaved };
    },
    onSuccess: async ({ savedId, coverSaved }) => {
      track(isEdit ? 'edit_book' : 'add_book', { title: form.title.trim() });
      setCoverFailed(!coverSaved);
      await queryClient.invalidateQueries({ queryKey: ['books'] });

      // Stay on the edit form so the cover can be tried again.
      if (isEdit && !coverSaved) {
        return;
      }

      if (isEdit && onSaved) {
        onSaved(savedId);
        return;
      }

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

  if (isEdit && (isBookLoading || isBookError)) {
    return (
      <div className={styles.page}>
        <p className={styles.subtitle} role={isBookError ? 'alert' : 'status'}>
          {isBookError ? 'Could not load the book.' : 'Loading book…'}
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
        <h2 className={styles.successTitle}>
          {isEdit ? 'Book Updated!' : 'Book Added!'}
        </h2>
        <p className={styles.successText}>
          {isEdit
            ? 'Your changes have been saved.'
            : 'The book has been successfully added to the catalog.'}
        </p>
        {coverFailed && (
          <p role="alert" className={styles.successText}>
            The cover image could not be uploaded. You can add it later by
            editing the book.
          </p>
        )}
        {!isEdit && (
          <Button
            onClick={() => {
              resetForm();
              setSubmitted(false);
            }}
          >
            Add Another
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{isEdit ? 'Edit Book' : 'Add Book'}</h1>
        <p className={styles.subtitle}>
          {isEdit
            ? 'Update the details of this book'
            : 'Fill in the details to add a new book to the catalog'}
        </p>
      </div>

      <form
        key={formKey}
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          if (form.title.trim() && form.author.trim()) {
            mutation.mutate();
          }
        }}
        aria-label={isEdit ? 'Edit book form' : 'Add book form'}
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
            <FormField
              label="ISBN"
              id="isbn"
              value={form.isbn}
              onChange={set('isbn')}
              placeholder="978-3-16-148410-0"
              hint="ISBN-10 or ISBN-13"
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
            initialValue={initialDescription}
            onChange={set('description')}
          />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Cover Image</h2>
          <ImageUpload
            label="Upload Cover Image"
            value={form.image || undefined}
            onChange={(image, coverFile) =>
              setForm((prev) => ({ ...prev, image, coverFile }))
            }
            onRemove={() =>
              setForm((prev) => ({ ...prev, image: '', coverFile: null }))
            }
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

        {coverFailed && (
          <p role="alert" className={styles.subtitle}>
            The book was saved, but the cover image could not be uploaded.
            Please try again.
          </p>
        )}
        {mutation.isError && (
          <p role="alert" className={styles.subtitle}>
            Could not {isEdit ? 'save' : 'add'} the book. Please check the fields and try again.
          </p>
        )}
        <div className={styles.actions}>
          <Button
            type="button"
            variant="ghost"
            onClick={resetForm}
          >
            Reset
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={mutation.isPending}
          >
            {isEdit ? 'Save changes' : 'Publish'}
          </Button>
        </div>
      </form>
    </div>
  );
};
