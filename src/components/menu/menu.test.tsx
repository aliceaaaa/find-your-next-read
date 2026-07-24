import { render, screen, fireEvent } from '@testing-library/react';
import { Menu } from './menu';

describe('Menu', () => {
  it('renders all navigation items', () => {
    render(<Menu activeNav="home" onNavChange={jest.fn()} />);
    ['Home', 'Library', 'Favorites'].forEach((label) =>
      expect(
        screen.getByRole('button', { name: new RegExp(`^${label}$`, 'i') }),
      ).toBeInTheDocument(),
    );
  });

  it('does not render Add Book for non-admin', () => {
    render(<Menu activeNav="home" onNavChange={jest.fn()} />);
    expect(
      screen.queryByRole('button', { name: /add book/i }),
    ).not.toBeInTheDocument();
  });

  it('renders Add Book for admin', () => {
    render(<Menu activeNav="home" isAdmin onNavChange={jest.fn()} />);
    expect(
      screen.getByRole('button', { name: /add book/i }),
    ).toBeInTheDocument();
  });

  it('marks active nav item with active class', () => {
    render(<Menu activeNav="library" onNavChange={jest.fn()} />);
    const libraryBtn = screen.getByRole('button', { name: /library/i });
    expect(libraryBtn).toHaveClass('active');
  });

  it('non-active items do not have active class', () => {
    render(<Menu activeNav="home" onNavChange={jest.fn()} />);
    const libraryBtn = screen.getByRole('button', { name: /library/i });
    expect(libraryBtn).not.toHaveClass('active');
  });

  it('calls onNavChange with correct id on nav item click', () => {
    const onNavChange = jest.fn();
    render(<Menu activeNav="home" onNavChange={onNavChange} />);
    fireEvent.click(screen.getByRole('button', { name: /library/i }));
    expect(onNavChange).toHaveBeenCalledWith('library');
  });
});
