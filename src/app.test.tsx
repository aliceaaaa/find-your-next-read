import { render, screen } from '@testing-library/react';
import App from './app';

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: /find your next read/i }),
    ).toBeInTheDocument();
  });

  it('renders the sidebar logo', () => {
    render(<App />);
    expect(
      screen.getByRole('button', { name: /find your next read — home/i }),
    ).toBeInTheDocument();
  });

  it('renders Popular Picks section', () => {
    render(<App />);
    expect(screen.getByText('Popular Picks')).toBeInTheDocument();
  });

  it('renders New Releases section', () => {
    render(<App />);
    expect(screen.getByText('New Releases')).toBeInTheDocument();
  });

  it('renders Categories section', () => {
    render(<App />);
    expect(screen.getAllByText('Categories').length).toBeGreaterThan(0);
  });
});
