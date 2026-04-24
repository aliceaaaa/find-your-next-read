import { render, screen, fireEvent } from '@testing-library/react';
import { CoverConstructor } from './cover-constructor';

const defaultProps = {
  coverColor: '#E63946',
  coverTextColor: '#FFFFFF',
  onCoverColorChange: jest.fn(),
  onTextColorChange: jest.fn(),
};

describe('CoverConstructor', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders book cover preview', () => {
    render(<CoverConstructor {...defaultProps} />);
    expect(screen.getByTestId('cover')).toBeInTheDocument();
  });

  it('renders background color swatches group', () => {
    render(<CoverConstructor {...defaultProps} />);
    expect(
      screen.getByRole('group', { name: /background color swatches/i }),
    ).toBeInTheDocument();
  });

  it('renders text color swatches group', () => {
    render(<CoverConstructor {...defaultProps} />);
    expect(
      screen.getByRole('group', { name: /text color swatches/i }),
    ).toBeInTheDocument();
  });

  it('renders custom background color picker', () => {
    render(<CoverConstructor {...defaultProps} />);
    expect(
      screen.getByLabelText(/custom background color/i),
    ).toBeInTheDocument();
  });

  it('renders custom text color picker', () => {
    render(<CoverConstructor {...defaultProps} />);
    expect(screen.getByLabelText(/custom text color/i)).toBeInTheDocument();
  });

  it('calls onCoverColorChange when background swatch is clicked', () => {
    const onCoverColorChange = jest.fn();
    render(
      <CoverConstructor
        {...defaultProps}
        onCoverColorChange={onCoverColorChange}
      />,
    );
    const swatches = screen.getAllByRole('button', {
      name: /background color/i,
    });
    fireEvent.click(swatches[1]);
    expect(onCoverColorChange).toHaveBeenCalled();
  });

  it('calls onTextColorChange when text swatch is clicked', () => {
    const onTextColorChange = jest.fn();
    render(
      <CoverConstructor
        {...defaultProps}
        onTextColorChange={onTextColorChange}
      />,
    );
    const swatches = screen.getAllByRole('button', { name: /text color/i });
    fireEvent.click(swatches[0]);
    expect(onTextColorChange).toHaveBeenCalledWith('#FFFFFF');
  });

  it('calls onCoverColorChange when custom color input changes', () => {
    const onCoverColorChange = jest.fn();
    render(
      <CoverConstructor
        {...defaultProps}
        onCoverColorChange={onCoverColorChange}
      />,
    );
    fireEvent.change(screen.getByLabelText(/custom background color/i), {
      target: { value: '#FF0000' },
    });
    expect(onCoverColorChange).toHaveBeenCalledWith('#FF0000');
  });

  it('calls onTextColorChange when custom text color input changes', () => {
    const onTextColorChange = jest.fn();
    render(
      <CoverConstructor
        {...defaultProps}
        onTextColorChange={onTextColorChange}
      />,
    );
    fireEvent.change(screen.getByLabelText(/custom text color/i), {
      target: { value: '#000000' },
    });
    expect(onTextColorChange).toHaveBeenCalledWith('#000000');
  });

  it('shows previewTitle in cover', () => {
    render(
      <CoverConstructor
        {...defaultProps}
        previewTitle="My Novel"
        previewAuthor="Jane Doe"
      />,
    );
    expect(screen.getByText('MY NOVEL')).toBeInTheDocument();
  });

  it('marks active swatch with aria-pressed true', () => {
    render(<CoverConstructor {...defaultProps} coverColor="#E63946" />);
    const activeBtn = screen.getByRole('button', {
      name: /background color #e63946/i,
    });
    expect(activeBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('marks non-active swatch with aria-pressed false', () => {
    render(<CoverConstructor {...defaultProps} coverColor="#E63946" />);
    const swatches = screen.getAllByRole('button', {
      name: /background color/i,
    });
    const nonActive = swatches.find(
      (b) => b.getAttribute('aria-pressed') === 'false',
    );
    expect(nonActive).toBeDefined();
  });

  it('shows background and text color section labels', () => {
    render(<CoverConstructor {...defaultProps} />);
    expect(screen.getByText('Background Color')).toBeInTheDocument();
    expect(screen.getByText('Text Color')).toBeInTheDocument();
  });
});
