import { useState } from 'react';
import cn from 'classnames';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiCreateReview, apiUpdateReview } from 'api';
import { Review } from 'types';
import { track } from '../../lib';
import { useAuth } from '../../contexts/auth-context';
import { Button } from '../button';
import styles from './review-form.module.scss';

type ReviewFormProps = {
  bookId: number;
  review?: Review;
  onCancel?: () => void;
  onSaved?: () => void;
};

export const ReviewForm = ({
  bookId,
  review,
  onCancel,
  onSaved,
}: ReviewFormProps) => {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [author, setAuthor] = useState(review?.authorName ?? '');
  const [text, setText] = useState(review?.text ?? '');
  const [rating, setRating] = useState(review?.rating ?? 8);

  const mutation = useMutation({
    mutationFn: () => {
      const payload = {
        author: author.trim(),
        text: text.trim(),
        rating,
        book_id: bookId,
      };

      return review
        ? apiUpdateReview(review.id, payload)
        : apiCreateReview({ ...payload, language: 'en' });
    },
    onSuccess: async () => {
      track(review ? 'edit_review' : 'add_review', { bookId, rating });
      await queryClient.invalidateQueries({ queryKey: ['reviews'] });

      if (review) {
        onSaved?.();
        return;
      }

      setAuthor('');
      setText('');
      setRating(8);
    },
  });

  const canSubmit = author.trim() && text.trim() && !mutation.isPending;

  if (!isAdmin) {
    return null;
  }

  return (
    <form
      className={cn(styles.form, review && styles.formEdit)}
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) {
          mutation.mutate();
        }
      }}
    >
      <h3 className={styles.title}>
        {review ? 'Edit review' : 'Write a review'}
      </h3>
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
        rows={review ? 8 : 4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      {mutation.isError && (
        <span className={styles.error}>
          Could not {review ? 'save' : 'submit'} the review. Please try again.
        </span>
      )}
      <div className={styles.actions}>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={!canSubmit}
          loading={mutation.isPending}
        >
          {review ? 'Save' : 'Submit review'}
        </Button>
      </div>
    </form>
  );
};
