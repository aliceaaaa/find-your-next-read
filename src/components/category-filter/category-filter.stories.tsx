import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { CategoryFilter } from './category-filter';

const meta: Meta<typeof CategoryFilter> = {
  title: 'Components/CategoryFilter',
  component: CategoryFilter,
  tags: ['autodocs'],
  args: {
    onChange: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof CategoryFilter>;

const categories = [
  'Romance',
  'History',
  'Science',
  'Fantasy',
  'Biography',
  'Mystery',
  'Self-Help',
];

export const Default: Story = {
  args: {
    categories,
    active: 'History',
  },
};

export const FirstActive: Story = {
  args: {
    categories,
    active: 'Romance',
  },
};

export const LastActive: Story = {
  args: {
    categories,
    active: 'Self-Help',
  },
};

export const FewCategories: Story = {
  args: {
    categories: ['Romance', 'History', 'Science'],
    active: 'Science',
  },
};
