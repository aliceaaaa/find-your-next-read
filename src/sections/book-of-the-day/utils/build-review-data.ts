import { ReviewsOfTheDay } from 'types';
import styles from '../book-of-the-day.module.scss';

type ReviewConfig = {
  key: string;
  initial: string;
  title: string;
  text: string;
  rating: number | null;
  avatarClassName?: string;
};

export const buildReviewData = (
  reviewsOfTheDay: ReviewsOfTheDay,
): ReviewConfig[] =>
  Object.entries(reviewsOfTheDay).map(([key, review]) => ({
    key,
    initial: key.charAt(0).toUpperCase(),
    title: `Review from ${key}`,
    text: review.text,
    rating: review.rating,
    avatarClassName: styles[key],
  }));
