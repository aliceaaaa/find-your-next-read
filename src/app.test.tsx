import { render, screen } from '@testing-library/react';
import App from './app';

describe('App', () => {
  it('renders the main heading', () => {
    render(<App />);
    expect(screen.getByText(/find your/i)).toBeInTheDocument();
  });

  it('renders the sidebar logo', () => {
    render(<App />);
    expect(screen.getByText('Find your next read')).toBeInTheDocument();
  });

  it('renders Popular Picks section', () => {
    render(<App />);
    expect(screen.getByText('Popular Picks')).toBeInTheDocument();
  });

  it('renders New Releases section', () => {
    render(<App />);
    expect(screen.getByText('New Releases')).toBeInTheDocument();
  });
});
