import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Menu } from './menu';

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onNavChange: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof Menu>;

export const Home: Story = {
  args: { activeNav: 'home' },
};

export const Search: Story = {
  args: { activeNav: 'search' },
};

export const Library: Story = {
  args: { activeNav: 'library' },
};

export const Favorites: Story = {
  args: { activeNav: 'favorites' },
};

export const Categories: Story = {
  args: { activeNav: 'categories' },
};

export const Reviews: Story = {
  args: { activeNav: 'reviews' },
};

export const Profile: Story = {
  args: { activeNav: 'profile' },
};

export const Settings: Story = {
  args: { activeNav: 'settings' },
};
