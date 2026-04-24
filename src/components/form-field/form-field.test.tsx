import { render, screen, fireEvent } from '@testing-library/react';
import { FormField } from './form-field';

describe('FormField', () => {
  const defaultProps = {
    label: 'Author',
    id: 'author',
    value: '',
    onChange: jest.fn(),
  };

  it('renders label', () => {
    render(<FormField {...defaultProps} />);
    expect(screen.getByText('Author')).toBeInTheDocument();
  });

  it('renders input element', () => {
    render(<FormField {...defaultProps} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('links label to input via htmlFor/id', () => {
    render(<FormField {...defaultProps} />);
    expect(screen.getByLabelText('Author')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<FormField {...defaultProps} required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('does not show required indicator by default', () => {
    render(<FormField {...defaultProps} />);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('calls onChange with input value', () => {
    const onChange = jest.fn();
    render(<FormField {...defaultProps} onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Tolstoy' },
    });
    expect(onChange).toHaveBeenCalledWith('Tolstoy');
  });

  it('shows placeholder text', () => {
    render(<FormField {...defaultProps} placeholder="Enter author name" />);
    expect(
      screen.getByPlaceholderText('Enter author name'),
    ).toBeInTheDocument();
  });

  it('renders current value', () => {
    render(<FormField {...defaultProps} value="Leo Tolstoy" />);
    expect(screen.getByDisplayValue('Leo Tolstoy')).toBeInTheDocument();
  });

  it('shows error message when error is set', () => {
    render(<FormField {...defaultProps} error="This field is required" />);
    expect(screen.getByRole('alert')).toHaveTextContent(
      'This field is required',
    );
  });

  it('applies error class when error is set', () => {
    render(<FormField {...defaultProps} error="Error" />);
    expect(screen.getByRole('textbox')).toHaveClass('input--error');
  });

  it('shows hint when no error', () => {
    render(<FormField {...defaultProps} hint="E.g. 2024" />);
    expect(screen.getByText('E.g. 2024')).toBeInTheDocument();
  });

  it('does not show hint when error is set', () => {
    render(<FormField {...defaultProps} error="Error" hint="Hint" />);
    expect(screen.queryByText('Hint')).not.toBeInTheDocument();
  });

  it('does not show error when no error', () => {
    render(<FormField {...defaultProps} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('renders number input type', () => {
    render(<FormField {...defaultProps} type="number" />);
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });
});
