import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { SearchBar } from './search-bar';

const meta: Meta<typeof SearchBar> = {
  title: 'Components/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  args: {
    onSearch: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {};

export const WithCallback: Story = {
  args: {
    onSearch: (query: string) => console.log('Search:', query),
  },
};
