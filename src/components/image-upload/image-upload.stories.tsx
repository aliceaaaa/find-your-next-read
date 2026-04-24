import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ImageUpload } from './image-upload';

const meta: Meta<typeof ImageUpload> = {
  title: 'Components/ImageUpload',
  component: ImageUpload,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ImageUpload>;

export const Default: Story = {
  args: {
    label: 'Upload Cover Image',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Book Cover Photo',
  },
};

const Interactive = () => {
  const [value, setValue] = useState<string | undefined>();
  return (
    <div style={{ width: 400 }}>
      <ImageUpload
        label="Upload Cover Image"
        value={value}
        onChange={setValue}
        onRemove={() => setValue(undefined)}
      />
    </div>
  );
};

export const InteractiveDemo: Story = {
  render: () => <Interactive />,
};
