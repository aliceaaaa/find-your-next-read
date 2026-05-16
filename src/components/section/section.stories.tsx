import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Section } from './section';

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

const meta: Meta<typeof Section> = {
  title: 'Components/Section',
  component: Section,
  tags: ['autodocs'],
  args: {
    onBookSelect: () => {},
    onBookmark: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof Section>;

export const PopularPicks: Story = {
  args: {
    title: 'Popular Picks',
    books,
    variant: 'popular',
  },
};

export const NewReleases: Story = {
  args: {
    title: 'New Releases',
    books,
    variant: 'new-releases',
  },
};

export const SingleBook: Story = {
  args: {
    title: 'Popular Picks',
    books: [books[0]],
    variant: 'popular',
  },
};
