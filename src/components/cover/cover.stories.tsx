import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Cover } from './cover';

const meta: Meta<typeof Cover> = {
  title: 'Components/Cover',
  component: Cover,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Cover>;

const book = {
  id: 1,
  title: 'The Weight Of Things',
  author: 'Marianne Fritz',
  rating: 4.5,
  reviewCount: 50,
  coverColor: '#E8A898',
  coverTextColor: '#C42B3F',
  categories: ['Romance', 'History'],
  description: 'A deeply moving story.',
  published: 2020,
  pages: 352,
  language: 'English',
  isBookmarked: false,
};

export const Small: Story = {
  args: { book, size: 'sm' },
};

export const Medium: Story = {
  args: { book, size: 'md' },
};

export const Large: Story = {
  args: { book, size: 'lg' },
};

export const DarkCover: Story = {
  args: {
    book: {
      ...book,
      coverColor: '#1B3A4B',
      coverTextColor: '#FFFFFF',
      title: 'The Midnight Library',
      author: 'Matt Haig',
    },
    size: 'md',
  },
};
