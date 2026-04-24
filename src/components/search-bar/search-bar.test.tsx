import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './search-bar';

describe('SearchBar', () => {
  it('renders input with placeholder', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText(/search by title/i)).toBeInTheDocument();
  });

  it('updates input value on typing', async () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search by title/i);
    await userEvent.type(input, 'Dune');
    expect(input).toHaveValue('Dune');
  });

  it('calls onSearch with current query on submit', async () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByPlaceholderText(/search by title/i);
    await userEvent.type(input, 'Dune');
    fireEvent.submit(input.closest('form')!);
    expect(onSearch).toHaveBeenCalledWith('Dune');
  });

  it('renders submit button', () => {
    render(<SearchBar />);
    expect(
      screen.getByRole('button', { name: /notifications/i }),
    ).toBeInTheDocument();
  });

  it('does not throw when onSearch is not provided', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search by title/i);
    expect(() => fireEvent.submit(input.closest('form')!)).not.toThrow();
  });
});
