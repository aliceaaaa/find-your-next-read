import { useState } from 'react';
import { Book, Post, PostStatus } from 'types';
import { FormField } from '../form-field';
import { CoverConstructor } from '../cover-constructor';
import { RichTextEditor } from '../rich-text-editor';
import { Select, SelectOption } from '../select';
import { PRESET_BG_COLORS, PRESET_TEXT_COLORS } from '../../constants';
import styles from './post-editor.module.scss';

type PostEditorProps = {
  books: Book[];
  categories: string[];
  post?: Post;
  onSave: (post: Omit<Post, 'id' | 'createdAt'>, status: PostStatus) => void;
};

export const PostEditor = ({
  books,
  categories,
  post,
  onSave,
}: PostEditorProps) => {
  const [title, setTitle] = useState(post?.title ?? '');
  const [body, setBody] = useState(post?.body ?? '');
  const [bookId, setBookId] = useState<number | null>(post?.bookId ?? null);
  const [coverColor, setCoverColor] = useState(
    post?.coverColor ?? PRESET_BG_COLORS[0],
  );
  const [coverTextColor, setCoverTextColor] = useState(
    post?.coverTextColor ?? PRESET_TEXT_COLORS[0],
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    post?.categories ?? [],
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedBook = books.find((b) => b.id === bookId) ?? null;

  const bookOptions: SelectOption[] = books.map((b) => ({
    value: b.id,
    label: b.title,
    sublabel: b.author,
    color: b.coverColor,
  }));

  const categoryOptions: SelectOption[] = categories
    .filter((c) => c !== 'All')
    .map((c) => ({ value: c, label: c }));

  const handleBookChange = (
    value: SelectOption['value'] | SelectOption['value'][] | null,
  ) => {
    const id = typeof value === 'number' ? value : null;
    setBookId(id);
    const book = books.find((b) => b.id === id);
    if (book) {
      setCoverColor(book.coverColor);
      setCoverTextColor(book.coverTextColor);
    }
  };

  const handleCategoryChange = (
    value: SelectOption['value'] | SelectOption['value'][] | null,
  ) => {
    if (Array.isArray(value)) {
      setSelectedCategories(value.map(String));
    } else {
      setSelectedCategories(value ? [String(value)] : []);
    }
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!title.trim()) {
      next.title = 'Title is required';
    }
    if (!body.trim() || body === '<br>') {
      next.body = 'Content is required';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (status: PostStatus) => {
    if (!validate()) {
      return;
    }
    onSave(
      {
        title: title.trim(),
        body,
        bookId,
        coverColor,
        coverTextColor,
        categories: selectedCategories,
        status,
      },
      status,
    );
  };

  return (
    <div className={styles.editor}>
      <div className={styles.topBar}>
        <h2 className={styles.heading}>{post ? 'Edit Post' : 'New Post'}</h2>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.draftBtn}
            onClick={() => handleSubmit('draft')}
          >
            Save as Draft
          </button>
          <button
            type="button"
            className={styles.publishBtn}
            onClick={() => handleSubmit('published')}
          >
            Publish
          </button>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.form}>
          <FormField
            id="post-title"
            label="Title"
            placeholder="Enter post title"
            required
            value={title}
            onChange={setTitle}
            error={errors.title}
          />
          <Select
            label="Related Book"
            options={bookOptions}
            value={bookId}
            placeholder="None"
            onChange={handleBookChange}
          />
          <Select
            label="Categories"
            options={categoryOptions}
            value={selectedCategories}
            placeholder="Select categories..."
            multiple
            onChange={handleCategoryChange}
          />
        </div>
        <CoverConstructor
          coverColor={coverColor}
          coverTextColor={coverTextColor}
          previewTitle={selectedBook?.title ?? (title || undefined)}
          previewAuthor={selectedBook?.author ?? undefined}
          onCoverColorChange={setCoverColor}
          onTextColorChange={setCoverTextColor}
        />
      </div>

      <RichTextEditor
        label="Content"
        placeholder="Write your post..."
        initialValue={post?.body}
        onChange={setBody}
      />
      {errors.body && (
        <span
          role="alert"
          style={{ fontSize: 12, color: '#ef4444', marginTop: -16 }}
        >
          {errors.body}
        </span>
      )}
    </div>
  );
};
