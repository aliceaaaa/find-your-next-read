import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiCreateReview } from 'api';
import { track } from '../../lib';
import { Button } from '../button';
import styles from './review-form.module.scss';

type ReviewFormProps = {
  bookId: number;
};

export const ReviewForm = ({ bookId }: ReviewFormProps) => {
  const queryClient = useQueryClient();
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(8);

  const mutation = useMutation({
    mutationFn: () =>
      apiCreateReview({ author: author.trim(), text: text.trim(), rating, book_id: bookId }),
    onSuccess: () => {
      track('add_review', { bookId, rating });
      setAuthor('');
      setText('');
      setRating(8);
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });

  const canSubmit = author.trim() && text.trim() && !mutation.isPending;

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) {
          mutation.mutate();
        }
      }}
    >
      <h3 className={styles.title}>Write a review</h3>
      <div className={styles.row}>
        <input
          className={styles.input}
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <label className={styles.ratingLabel}>
          Rating
          <select
            className={styles.select}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}/10
              </option>
            ))}
          </select>
        </label>
      </div>
      <textarea
        className={styles.textarea}
        placeholder="Share your thoughts…"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      {mutation.isError && (
        <span className={styles.error}>
          Could not submit the review. Please try again.
        </span>
      )}
      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={!canSubmit} loading={mutation.isPending}>
          Submit review
        </Button>
      </div>
    </form>
  );
};
