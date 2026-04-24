import { render, screen, fireEvent } from '@testing-library/react';
import { RichTextEditor } from './rich-text-editor';

describe('RichTextEditor', () => {
  it('renders the editor', () => {
    render(<RichTextEditor />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<RichTextEditor label="Description" />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('does not render label when not provided', () => {
    render(<RichTextEditor />);
    expect(screen.queryByText('Description')).not.toBeInTheDocument();
  });

  it('renders formatting toolbar', () => {
    render(<RichTextEditor />);
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });

  it('renders Bold button', () => {
    render(<RichTextEditor />);
    expect(screen.getByRole('button', { name: /bold/i })).toBeInTheDocument();
  });

  it('renders Italic button', () => {
    render(<RichTextEditor />);
    expect(screen.getByRole('button', { name: /italic/i })).toBeInTheDocument();
  });

  it('renders Underline button', () => {
    render(<RichTextEditor />);
    expect(
      screen.getByRole('button', { name: /underline/i }),
    ).toBeInTheDocument();
  });

  it('renders Bullet list button', () => {
    render(<RichTextEditor />);
    expect(
      screen.getByRole('button', { name: /bullet list/i }),
    ).toBeInTheDocument();
  });

  it('renders Numbered list button', () => {
    render(<RichTextEditor />);
    expect(
      screen.getByRole('button', { name: /numbered list/i }),
    ).toBeInTheDocument();
  });

  it('editor has contenteditable attribute', () => {
    render(<RichTextEditor />);
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'contenteditable',
      'true',
    );
  });

  it('calls onChange on input', () => {
    const onChange = jest.fn();
    render(<RichTextEditor onChange={onChange} />);
    fireEvent.input(screen.getByRole('textbox'));
    expect(onChange).toHaveBeenCalled();
  });

  it('editor has multiline aria attribute', () => {
    render(<RichTextEditor />);
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-multiline',
      'true',
    );
  });

  it('renders placeholder via data attribute', () => {
    render(<RichTextEditor placeholder="Enter text here" />);
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'data-placeholder',
      'Enter text here',
    );
  });
});
