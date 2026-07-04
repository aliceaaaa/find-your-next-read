import { render, screen } from '@testing-library/react';
import { Book } from 'types';
import { Cover } from './cover';

const book: Book = {
  id: 1,
  title: 'The Weight Of Things',
  author: 'Marianne Fritz',
  rating: 4.5,
  reviewCount: 50,
  reviews: [],
  coverColor: '#E8A898',
  coverTextColor: '#C42B3F',
  categories: ['Romance', 'History'],
  description: 'A moving story.',
  published: 2020,
  pages: 352,
  language: 'English',
};

describe('Cover', () => {
  it('renders the book title in uppercase', () => {
    render(<Cover book={book} />);
    expect(screen.getByText('THE WEIGHT OF THINGS')).toBeInTheDocument();
  });

  it('renders the last name of the author', () => {
    render(<Cover book={book} />);
    expect(screen.getByText('Fritz')).toBeInTheDocument();
  });

  it('applies coverColor as background', () => {
    render(<Cover book={book} />);
    const cover = screen.getByTestId('cover');

    expect(cover).toHaveStyle({
      backgroundColor: '#E8A898',
    });
  });

  it('applies coverTextColor to title', () => {
    render(<Cover book={book} />);
    const title = screen.getByText('THE WEIGHT OF THINGS');

    expect(title).toHaveStyle({
      color: '#C42B3F',
    });
  });

  it('adds size class "lg"', () => {
    render(<Cover book={book} size="lg" />);
    const cover = screen.getByTestId('cover');
    expect(cover).toHaveClass('Cover', 'lg');
  });

  it('defaults to md size class', () => {
    render(<Cover book={book} />);
    const cover = screen.getByTestId('cover');
    expect(cover).toHaveClass('Cover', 'md');
  });
});
