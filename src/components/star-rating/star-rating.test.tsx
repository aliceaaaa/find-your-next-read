import { render, screen } from '@testing-library/react';
import { StarRating } from './star-rating';

describe('StarRating', () => {
  it('renders 5 SVG stars', () => {
    render(<StarRating rating={4} />);
    expect(screen.getAllByTestId('star-icon')).toHaveLength(5);
  });

  it('renders without crashing for rating=0', () => {
    render(<StarRating rating={0} />);
    expect(screen.getAllByTestId('star-icon')).toHaveLength(5);
  });

  it('renders without crashing for rating=5', () => {
    render(<StarRating rating={5} />);
    expect(screen.getAllByTestId('star-icon')).toHaveLength(5);
  });

  it('renders half star — clipPath is present for rating=4.5', () => {
    render(<StarRating rating={4.5} />);
    expect(screen.getByTestId('half-clip-star-5-4.5')).toBeInTheDocument();
  });

  it('no clipPath for whole number rating', () => {
    render(<StarRating rating={4} />);
    expect(screen.queryByTestId('half-clip-star-5-4')).not.toBeInTheDocument();
  });

  it('applies custom size to each SVG', () => {
    render(<StarRating rating={3} size={24} />);
    const svgs = screen.getAllByTestId('star-icon');
    svgs.forEach((svg) => {
      expect(svg).toHaveAttribute('width', '24');
      expect(svg).toHaveAttribute('height', '24');
    });
  });

  it('no clipPath for full integer rating', () => {
    render(<StarRating rating={3} />);
    expect(screen.queryByTestId('half-clip-star-4-3')).not.toBeInTheDocument();
  });

  it('renders correctly for rating=2.5', () => {
    render(<StarRating rating={2.5} />);
    expect(screen.getByTestId('half-clip-star-3-2.5')).toBeInTheDocument();
    expect(screen.getAllByTestId('star-icon')).toHaveLength(5);
  });
});
