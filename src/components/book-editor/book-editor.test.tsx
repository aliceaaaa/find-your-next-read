import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BookEditor } from './book-editor';

const renderEditor = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <BookEditor
          allBooks={[]}
          onSaved={jest.fn()}
          onCancel={jest.fn()}
        />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('BookEditor', () => {
  it('renders title and author fields', () => {
    renderEditor();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
  });

  it('renders the create button', () => {
    renderEditor();
    expect(
      screen.getByRole('button', { name: /create book/i }),
    ).toBeInTheDocument();
  });

  it('shows validation errors when submitted empty', () => {
    renderEditor();
    fireEvent.click(screen.getByRole('button', { name: /create book/i }));
    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Author is required')).toBeInTheDocument();
  });
});
