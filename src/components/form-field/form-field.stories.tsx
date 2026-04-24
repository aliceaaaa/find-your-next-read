import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { FormField } from './form-field';

const meta: Meta<typeof FormField> = {
  title: 'Components/FormField',
  component: FormField,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['text', 'number', 'email', 'url'] },
    required: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  args: {
    label: 'Author',
    id: 'author',
    value: '',
    placeholder: 'Enter author name',
    onChange: () => {},
  },
};

export const WithValue: Story = {
  args: {
    label: 'Author',
    id: 'author',
    value: 'Leo Tolstoy',
    onChange: () => {},
  },
};

export const Required: Story = {
  args: {
    label: 'Title',
    id: 'title',
    value: '',
    placeholder: 'Enter book title',
    required: true,
    onChange: () => {},
  },
};

export const WithError: Story = {
  args: {
    label: 'Year of Publication',
    id: 'year',
    type: 'number',
    value: '',
    error: 'Please enter a valid year',
    onChange: () => {},
  },
};

export const WithHint: Story = {
  args: {
    label: 'Year of Publication',
    id: 'year',
    type: 'number',
    value: '',
    placeholder: '2024',
    hint: 'Enter the year the book was first published',
    onChange: () => {},
  },
};

export const NumberType: Story = {
  args: {
    label: 'Pages',
    id: 'pages',
    type: 'number',
    value: '',
    placeholder: '350',
    hint: 'Total number of pages',
    onChange: () => {},
  },
};

const Interactive = () => {
  const [value, setValue] = useState('');
  return (
    <div style={{ width: 320 }}>
      <FormField
        label="Author"
        id="author-interactive"
        value={value}
        onChange={setValue}
        placeholder="Start typing..."
        hint="First and last name"
      />
    </div>
  );
};

export const InteractiveDemo: Story = {
  render: () => <Interactive />,
};
