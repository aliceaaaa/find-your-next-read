import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Card } from './card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    onSelect: () => {},
    onBookmark: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

const baseBook = {
  id: 3,
  title: 'The Weight Of Things',
  author: 'Marianne Fritz',
  rating: 4.5,
  reviewCount: 50,
  coverColor: '#E8A898',
  coverTextColor: '#C42B3F',
  categories: ['Romance', 'History'],
  description:
    'A deeply moving and thought-provoking story about love, loss, and the search for meaning.',
  published: 2020,
  pages: 352,
  language: 'English',
  isBookmarked: false,
};

export const Default: Story = {
  args: { book: baseBook },
};

export const Bookmarked: Story = {
  args: { book: { ...baseBook, isBookmarked: true } },
};

export const HighRating: Story = {
  args: {
    book: {
      ...baseBook,
      title: 'Create Your Own Sunshine',
      author: 'Peter Butler',
      rating: 4.8,
      reviewCount: 96,
      coverColor: '#F2EDE4',
      coverTextColor: '#333333',
    },
  },
};

export const DarkCover: Story = {
  args: {
    book: {
      ...baseBook,
      title: 'The Midnight Library',
      author: 'Matt Haig',
      rating: 4.7,
      reviewCount: 200,
      coverColor: '#1B3A4B',
      coverTextColor: '#FFFFFF',
    },
  },
};
