import { render, screen, fireEvent } from '@testing-library/react';
import { Menu } from './menu';

describe('Menu', () => {
  it('renders all navigation items', () => {
    render(<Menu activeNav="home" onNavChange={jest.fn()} />);
    [
      'Home',
      'Search',
      'Library',
      'Favorites',
      'Categories',
      'Reviews',
      'Profile',
      'Settings',
    ].forEach((label) =>
      expect(
        screen.getByRole('button', { name: new RegExp(label, 'i') }),
      ).toBeInTheDocument(),
    );
  });

  it('marks active nav item with active class', () => {
    render(<Menu activeNav="search" onNavChange={jest.fn()} />);
    const searchBtn = screen.getByRole('button', { name: /search/i });
    expect(searchBtn).toHaveClass('active');
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

  it('renders user name and email', () => {
    render(<Menu activeNav="home" onNavChange={jest.fn()} />);
    expect(screen.getByText('Alexandra')).toBeInTheDocument();
    expect(screen.getByText('alexandra@mail.com')).toBeInTheDocument();
  });

  it('renders Premium Access block', () => {
    render(<Menu activeNav="home" onNavChange={jest.fn()} />);
    expect(screen.getByText('Premium Access')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /upgrade now/i }),
    ).toBeInTheDocument();
  });
});
