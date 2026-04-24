import { render, screen, fireEvent } from '@testing-library/react';
import { Book } from 'types';
import { Card } from './card';

const book: Book = {
  id: 3,
  title: 'The Weight Of Things',
  author: 'Marianne Fritz',
  rating: 4.5,
  reviewCount: 50,
  coverColor: '#E8A898',
  coverTextColor: '#C42B3F',
  categories: ['Romance', 'History'],
  description: 'A moving story.',
  published: 2020,
  pages: 352,
  language: 'English',
  isBookmarked: false,
};

describe('Card', () => {
  it('renders book title', () => {
    render(<Card book={book} onSelect={jest.fn()} onBookmark={jest.fn()} />);
    expect(screen.getByText('The Weight Of Things')).toBeInTheDocument();
  });

  it('renders author', () => {
    render(<Card book={book} onSelect={jest.fn()} onBookmark={jest.fn()} />);
    expect(screen.getByText('Author: Marianne Fritz')).toBeInTheDocument();
  });

  it('renders rating and review count', () => {
    render(<Card book={book} onSelect={jest.fn()} onBookmark={jest.fn()} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('calls onSelect when card is clicked', () => {
    const onSelect = jest.fn();
    render(<Card book={book} onSelect={onSelect} onBookmark={jest.fn()} />);
    fireEvent.click(screen.getByText('The Weight Of Things'));
    expect(onSelect).toHaveBeenCalledWith(book);
  });

  it('calls onBookmark when bookmark button is clicked', () => {
    const onBookmark = jest.fn();
    render(<Card book={book} onSelect={jest.fn()} onBookmark={onBookmark} />);
    fireEvent.click(screen.getByRole('button', { name: /add bookmark/i }));
    expect(onBookmark).toHaveBeenCalledWith(book.id);
  });

  it('bookmark button does not trigger onSelect', () => {
    const onSelect = jest.fn();
    render(<Card book={book} onSelect={onSelect} onBookmark={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /add bookmark/i }));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('shows remove bookmark aria-label when bookmarked', () => {
    render(
      <Card
        book={{ ...book, isBookmarked: true }}
        onSelect={jest.fn()}
        onBookmark={jest.fn()}
      />,
    );
    expect(
      screen.getByRole('button', { name: /remove bookmark/i }),
    ).toBeInTheDocument();
  });
});
