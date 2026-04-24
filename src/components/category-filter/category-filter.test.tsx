import { render, screen, fireEvent } from '@testing-library/react';
import { CategoryFilter } from './category-filter';

const categories = ['Romance', 'History', 'Science', 'Fantasy', 'Biography'];

describe('CategoryFilter', () => {
  it('renders all category pills', () => {
    render(
      <CategoryFilter
        categories={categories}
        active="History"
        onChange={jest.fn()}
      />,
    );
    categories.forEach((cat) => {
      expect(screen.getByRole('button', { name: cat })).toBeInTheDocument();
    });
  });

  it('marks active category with active class', () => {
    render(
      <CategoryFilter
        categories={categories}
        active="History"
        onChange={jest.fn()}
      />,
    );
    const historyBtn = screen.getByRole('button', { name: 'History' });
    expect(historyBtn).toHaveClass('active');
  });

  it('does not mark non-active categories', () => {
    render(
      <CategoryFilter
        categories={categories}
        active="History"
        onChange={jest.fn()}
      />,
    );
    const romanceBtn = screen.getByRole('button', { name: 'Romance' });
    expect(romanceBtn).not.toHaveClass('active');
  });

  it('calls onChange with correct category on click', () => {
    const onChange = jest.fn();
    render(
      <CategoryFilter
        categories={categories}
        active="History"
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Science' }));
    expect(onChange).toHaveBeenCalledWith('Science');
  });

  it('renders "View all" button', () => {
    render(
      <CategoryFilter
        categories={categories}
        active="History"
        onChange={jest.fn()}
      />,
    );
    expect(
      screen.getByRole('button', { name: /view all/i }),
    ).toBeInTheDocument();
  });

  it('renders section title "Categories"', () => {
    render(
      <CategoryFilter
        categories={categories}
        active="History"
        onChange={jest.fn()}
      />,
    );
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });
});
