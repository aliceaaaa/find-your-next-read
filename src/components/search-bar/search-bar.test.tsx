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
      screen.getByRole('button', { name: /^search$/i }),
    ).toBeInTheDocument();
  });

  it('shows a clear button that empties the input and reports it', async () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByPlaceholderText(/search by title/i);

    expect(
      screen.queryByRole('button', { name: /clear search/i }),
    ).not.toBeInTheDocument();

    await userEvent.type(input, 'Dune');
    await userEvent.click(screen.getByRole('button', { name: /clear search/i }));

    expect(input).toHaveValue('');
    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('calls onSearch with an empty query when the text is deleted', async () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByPlaceholderText(/search by title/i);

    await userEvent.type(input, 'ab');
    await userEvent.clear(input);

    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('follows the value prop', () => {
    const { rerender } = render(<SearchBar value="Dune" />);
    const input = screen.getByPlaceholderText(/search by title/i);
    expect(input).toHaveValue('Dune');

    rerender(<SearchBar value="" />);
    expect(input).toHaveValue('');
  });

  it('does not throw when onSearch is not provided', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/search by title/i);
    expect(() => fireEvent.submit(input.closest('form')!)).not.toThrow();
  });
});
