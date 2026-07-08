import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { BookShelf } from './book-shelf';

const books = [
  {
    id: 1,
    title: 'I Feel Bad When You Feel Bad',
    author: 'Alex Miller',
    rating: 4.6,
    reviewCount: 128,
    coverColor: '#5C6147',
    coverTextColor: '#E63946',
    categories: ['Romance'],
    description: 'A raw and honest exploration of empathy and human connection in modern times.',
    published: 2021,
    pages: 280,
    language: 'English',
    isBookmarked: true,
  },
  {
    id: 2,
    title: 'The Reign of Queen Victoria',
    author: 'Mernie Hakley',
    rating: 4.6,
    reviewCount: 128,
    coverColor: '#B5485E',
    coverTextColor: '#FFFFFF',
    categories: ['History', 'Biography'],
    description: "A sweeping narrative of one of history's most iconic monarchs.",
    published: 2019,
    pages: 450,
    language: 'English',
    isBookmarked: true,
  },
];

const meta: Meta<typeof BookShelf> = {
  title: 'Components/BookShelf',
  component: BookShelf,
  tags: ['autodocs'],
  args: {
    onBookSelect: () => {},
    onBookmark: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof BookShelf>;

export const FullCards: Story = {
  args: {
    title: 'Popular Picks',
    books,
    cardType: 'full',
  },
};

export const MiniCards: Story = {
  args: {
    title: 'New Releases',
    books,
    cardType: 'mini',
  },
};

export const SingleBook: Story = {
  args: {
    title: 'Popular Picks',
    books: [books[0]],
    cardType: 'full',
  },
};
