import { FormEvent, useState } from 'react';
import { Review } from 'types';
import { Button } from '../button';
import { Input } from '../input';
import { useCreateReview, useUpdateReview } from '../../hooks/use-review-mutations';
import styles from './review-editor.module.scss';

type ReviewEditorProps = {
  bookId: number;
  review?: Review;
  onDone: () => void;
};

export const ReviewEditor = ({ bookId, review, onDone }: ReviewEditorProps) => {
  const [author, setAuthor] = useState(review?.author ?? '');
  const [text, setText] = useState(review?.text ?? '');
  const [rating, setRating] = useState(review?.rating ?? 5);
  const [language, setLanguage] = useState(review?.language ?? 'en');
  const [error, setError] = useState('');

  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const submitting = createReview.isPending || updateReview.isPending;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) {
      setError('Author and text are required.');
      return;
    }
    setError('');

    try {
      if (review) {
        await updateReview.mutateAsync({
          id: review.id,
          bookId,
          payload: {
            author: author.trim(),
            text: text.trim(),
            rating,
            language: language.trim() || 'en',
          },
        });
      } else {
        await createReview.mutateAsync({
          author: author.trim(),
          text: text.trim(),
          book_id: bookId,
          rating,
          language: language.trim() || 'en',
        });
      }
      onDone();
    } catch {
      setError('Could not save review. Please try again.');
    }
  };

  return (
    <form className={styles.editor} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="review-author">
          Author
        </label>
        <Input
          id="review-author"
          value={author}
          onChange={setAuthor}
          placeholder="Reviewer name"
          required
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <span className={styles.label}>Rating</span>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={styles.starBtn}
                aria-label={`Rate ${value}`}
                onClick={() => setRating(value)}
              >
                <span className={value <= rating ? styles.starOn : styles.starOff}>
                  ★
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="review-language">
            Language
          </label>
          <Input
            id="review-language"
            value={language}
            onChange={setLanguage}
            placeholder="en"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="review-text">
          Review
        </label>
        <textarea
          id="review-text"
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write the review..."
          rows={4}
          required
        />
      </div>

      {error && (
        <span className={styles.error} role="alert">
          {error}
        </span>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.cancel}
          onClick={onDone}
          disabled={submitting}
        >
          Cancel
        </button>
        <Button type="submit" loading={submitting}>
          {review ? 'Save review' : 'Add review'}
        </Button>
      </div>
    </form>
  );
};
