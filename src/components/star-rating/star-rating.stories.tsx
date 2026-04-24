import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { StarRating } from './star-rating';

const meta: Meta<typeof StarRating> = {
  title: 'Components/StarRating',
  component: StarRating,
  tags: ['autodocs'],
  argTypes: {
    rating: { control: { type: 'number', min: 0, max: 5, step: 0.5 } },
    size: { control: { type: 'number', min: 10, max: 32 } },
  },
};

export default meta;
type Story = StoryObj<typeof StarRating>;

export const Full: Story = {
  args: { rating: 5, size: 16 },
};

export const HalfStar: Story = {
  args: { rating: 4.5, size: 16 },
};

export const Partial: Story = {
  args: { rating: 3.5, size: 16 },
};

export const Low: Story = {
  args: { rating: 1, size: 16 },
};

export const Large: Story = {
  args: { rating: 4.5, size: 28 },
};

export const Zero: Story = {
  args: { rating: 0, size: 16 },
};
