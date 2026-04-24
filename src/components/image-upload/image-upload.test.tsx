import { render, screen, fireEvent } from '@testing-library/react';
import { ImageUpload } from './image-upload';

describe('ImageUpload', () => {
  it('renders dropzone when no value', () => {
    render(<ImageUpload />);
    expect(
      screen.getByRole('button', { name: /upload image/i }),
    ).toBeInTheDocument();
  });

  it('renders label', () => {
    render(<ImageUpload label="Book Cover" />);
    expect(screen.getByText('Book Cover')).toBeInTheDocument();
  });

  it('renders upload text in dropzone', () => {
    render(<ImageUpload />);
    expect(screen.getByText(/click or drag image here/i)).toBeInTheDocument();
  });

  it('renders size hint in dropzone', () => {
    render(<ImageUpload />);
    expect(screen.getByText(/png, jpg, webp/i)).toBeInTheDocument();
  });

  it('renders preview when value is provided', () => {
    render(<ImageUpload value="data:image/png;base64,abc" />);
    expect(screen.getByAltText('Upload preview')).toBeInTheDocument();
  });

  it('does not render dropzone when value is provided', () => {
    render(<ImageUpload value="data:image/png;base64,abc" />);
    expect(
      screen.queryByRole('button', { name: /upload image/i }),
    ).not.toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    const onRemove = jest.fn();
    render(
      <ImageUpload value="data:image/png;base64,abc" onRemove={onRemove} />,
    );
    fireEvent.click(screen.getByRole('button', { name: /remove image/i }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('renders hidden file input', () => {
    render(<ImageUpload />);
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
  });

  it('adds active class on drag over', () => {
    render(<ImageUpload />);
    const dropzone = screen.getByRole('button', { name: /upload image/i });
    fireEvent.dragOver(dropzone);
    expect(dropzone).toHaveClass('dropzone--active');
  });

  it('removes active class on drag leave', () => {
    render(<ImageUpload />);
    const dropzone = screen.getByRole('button', { name: /upload image/i });
    fireEvent.dragOver(dropzone);
    fireEvent.dragLeave(dropzone);
    expect(dropzone).not.toHaveClass('dropzone--active');
  });

  it('shows drop text when dragging', () => {
    render(<ImageUpload />);
    const dropzone = screen.getByRole('button', { name: /upload image/i });
    fireEvent.dragOver(dropzone);
    expect(screen.getByText('Drop image here')).toBeInTheDocument();
  });

  it('accepts custom label', () => {
    render(<ImageUpload label="Custom Label" />);
    expect(screen.getByText('Custom Label')).toBeInTheDocument();
  });
});
