import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders as a <button> element', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies primary class by default', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button')).toHaveClass('primary');
  });

  it('applies secondary variant class', () => {
    render(<Button variant="secondary">Click</Button>);
    expect(screen.getByRole('button')).toHaveClass('secondary');
  });

  it('applies ghost variant class', () => {
    render(<Button variant="ghost">Click</Button>);
    expect(screen.getByRole('button')).toHaveClass('ghost');
  });

  it('applies md size class by default', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button')).toHaveClass('md');
  });

  it('applies sm size class', () => {
    render(<Button size="sm">Click</Button>);
    expect(screen.getByRole('button')).toHaveClass('sm');
  });

  it('applies lg size class', () => {
    render(<Button size="lg">Click</Button>);
    expect(screen.getByRole('button')).toHaveClass('lg');
  });

  it('is enabled by default', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when loading is true', () => {
    render(<Button loading>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows spinner when loading', () => {
    render(<Button loading>Click</Button>);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('does not show spinner when not loading', () => {
    render(<Button>Click</Button>);
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
  });

  it('applies loading class when loading', () => {
    render(<Button loading>Click</Button>);
    expect(screen.getByRole('button')).toHaveClass('loading');
  });

  it('applies full-width class when fullWidth is true', () => {
    render(<Button fullWidth>Click</Button>);
    expect(screen.getByRole('button')).toHaveClass('full');
  });

  it('does not apply full-width class by default', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button')).not.toHaveClass('full');
  });

  it('renders leftIcon', () => {
    render(
      <Button leftIcon={<span data-testid="icon-left">★</span>}>Click</Button>,
    );
    expect(screen.getByTestId('icon-left')).toBeInTheDocument();
  });

  it('renders rightIcon', () => {
    render(
      <Button rightIcon={<span data-testid="icon-right">→</span>}>
        Click
      </Button>,
    );
    expect(screen.getByTestId('icon-right')).toBeInTheDocument();
  });

  it('does not render icons when loading', () => {
    render(
      <Button loading leftIcon={<span data-testid="icon-left">★</span>}>
        Click
      </Button>,
    );
    expect(screen.queryByTestId('icon-left')).not.toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const onClick = jest.fn();
    render(
      <Button disabled onClick={onClick}>
        Click
      </Button>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when loading', () => {
    const onClick = jest.fn();
    render(
      <Button loading onClick={onClick}>
        Click
      </Button>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('passes through extra html attributes', () => {
    render(
      <Button type="submit" aria-label="submit form">
        Click
      </Button>,
    );
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('type', 'submit');
    expect(btn).toHaveAttribute('aria-label', 'submit form');
  });

  it('merges custom className', () => {
    render(<Button className="custom-cls">Click</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-cls');
  });
});
