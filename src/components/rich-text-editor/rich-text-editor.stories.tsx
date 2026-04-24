import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { RichTextEditor } from './rich-text-editor';

const meta: Meta<typeof RichTextEditor> = {
  title: 'Components/RichTextEditor',
  component: RichTextEditor,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RichTextEditor>;

export const Default: Story = {
  args: {
    placeholder: 'Write your description here...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'What I think',
    placeholder: 'Your thoughts....',
  },
};

export const WithInitialValue: Story = {
  args: {
    label: 'Description',
    initialValue:
      '<p>This is a <b>great</b> book about <i>adventures</i> and discovery.</p>',
  },
};

const Interactive = () => {
  const [html, setHtml] = useState('');
  return (
    <div style={{ width: 540 }}>
      <RichTextEditor
        label="What I think"
        placeholder="Write something amazing..."
        onChange={setHtml}
      />
      {html && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: '#f5f5f7',
            borderRadius: 8,
            fontSize: 12,
            color: '#6B7280',
          }}
        >
          <strong>HTML output:</strong>
          <pre style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap' }}>
            {html}
          </pre>
        </div>
      )}
    </div>
  );
};

export const InteractiveDemo: Story = {
  render: () => <Interactive />,
};
