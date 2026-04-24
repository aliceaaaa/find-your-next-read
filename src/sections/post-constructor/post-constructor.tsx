import { useState } from 'react';
import { useAuth } from '../../contexts/auth-context';
import {
  FormField,
  Button,
  ImageUpload,
  RichTextEditor,
  CoverConstructor,
} from '../../components';
import styles from './post-constructor.module.scss';

type FormState = {
  title: string;
  author: string;
  published: string;
  pages: string;
  language: string;
  categories: string;
  description: string;
  image: string;
  coverColor: string;
  coverTextColor: string;
};

const INITIAL: FormState = {
  title: '',
  author: '',
  published: '',
  pages: '',
  language: '',
  categories: '',
  description: '',
  image: '',
  coverColor: '#1D3557',
  coverTextColor: '#FFFFFF',
};

export const PostConstructor = () => {
  const { isAdmin } = useAuth();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

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
        <h2 className={styles.successTitle}>Post Created!</h2>
        <p className={styles.successText}>
          Your book post has been successfully created.
        </p>
        <Button
          onClick={() => {
            setForm(INITIAL);
            setSubmitted(false);
          }}
        >
          Create Another
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create Book Post</h1>
        <p className={styles.subtitle}>
          Fill in the details to add a new book to the catalog
        </p>
      </div>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        aria-label="Create book post form"
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
              label="Categories"
              id="categories"
              value={form.categories}
              onChange={set('categories')}
              placeholder="Fiction, History, Romance"
              hint="Separate multiple categories with commas"
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
          />
        </section>

        <div className={styles.actions}>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setForm(INITIAL)}
          >
            Reset
          </Button>
          <Button type="submit" variant="primary" size="lg">
            Create Post
          </Button>
        </div>
      </form>
    </div>
  );
};
