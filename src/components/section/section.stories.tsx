import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { popularBooks, newReleases } from '../../data/mock-data';
import { Section } from './section';

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
    books: popularBooks,
    variant: 'popular',
  },
};

export const NewReleases: Story = {
  args: {
    title: 'New Releases',
    books: newReleases,
    variant: 'new-releases',
  },
};

export const SingleBook: Story = {
  args: {
    title: 'Popular Picks',
    books: [popularBooks[0]],
    variant: 'popular',
  },
};
