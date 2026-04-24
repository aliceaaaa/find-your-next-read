import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { CoverConstructor } from './cover-constructor';

const meta: Meta<typeof CoverConstructor> = {
  title: 'Components/CoverConstructor',
  component: CoverConstructor,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CoverConstructor>;

export const Default: Story = {
  args: {
    coverColor: '#E63946',
    coverTextColor: '#FFFFFF',
    onCoverColorChange: () => {},
    onTextColorChange: () => {},
  },
};

export const DarkTheme: Story = {
  args: {
    coverColor: '#1D3557',
    coverTextColor: '#F8F9FA',
    onCoverColorChange: () => {},
    onTextColorChange: () => {},
    previewTitle: 'Dark Cover',
    previewAuthor: 'Author Name',
  },
};

export const GoldTheme: Story = {
  args: {
    coverColor: '#E9C46A',
    coverTextColor: '#111827',
    onCoverColorChange: () => {},
    onTextColorChange: () => {},
    previewTitle: 'Golden Era',
    previewAuthor: 'Jane Smith',
  },
};

const Interactive = () => {
  const [coverColor, setCoverColor] = useState('#1D3557');
  const [coverTextColor, setCoverTextColor] = useState('#FFFFFF');
  return (
    <div style={{ padding: 24 }}>
      <CoverConstructor
        coverColor={coverColor}
        coverTextColor={coverTextColor}
        onCoverColorChange={setCoverColor}
        onTextColorChange={setCoverTextColor}
        previewTitle="War and Peace"
        previewAuthor="Leo Tolstoy"
      />
    </div>
  );
};

export const InteractiveDemo: Story = {
  render: () => <Interactive />,
};
