import { Review } from 'types';
import { ApiReview, apiGetReviews } from './client';

const toInitials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const mapApiReview = (apiReview: ApiReview): Review => ({
  id: apiReview.id,
  bookId: apiReview.book_id,
  authorName: apiReview.author,
  authorInitials: toInitials(apiReview.author),
  rating: apiReview.rating,
  text: apiReview.text,
  date: new Date(apiReview.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
});

export const fetchReviews = async (): Promise<Review[]> => {
  const allReviews: Review[] = [];
  let page = 1;

  while (true) {
    const res = await apiGetReviews(page);
    allReviews.push(...res.data.map(mapApiReview));

    if (res.current_page >= res.last_page) break;
    page++;
  }

  return allReviews;
};
