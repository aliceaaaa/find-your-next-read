import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../contexts/auth-context';
import { PostConstructor } from './post-constructor';

jest.mock('api', () => ({
  ...jest.requireActual('api'),
  apiCreateBook: jest.fn(() => Promise.resolve({ id: 1 })),
}));

const renderWith = (isAdmin: boolean) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <AuthProvider defaultIsAdmin={isAdmin}>
        <PostConstructor />
      </AuthProvider>
    </QueryClientProvider>,
  );
};

const renderDefault = () => renderWith(false);
const renderAsAdmin = () => renderWith(true);

const fillRequired = () => {
  fireEvent.change(screen.getByLabelText(/^title/i), {
    target: { value: 'My Book' },
  });
  fireEvent.change(screen.getByLabelText(/^author/i), {
    target: { value: 'Jane Doe' },
  });
};

describe('PostConstructor', () => {
  describe('access control', () => {
    it('shows access denied screen when not admin', () => {
      renderDefault();
      expect(screen.getByTestId('access-denied')).toBeInTheDocument();
    });

    it('shows Access Denied heading when not admin', () => {
      renderDefault();
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });

    it('does not show form when not admin', () => {
      renderDefault();
      expect(
        screen.queryByRole('form', { name: /add book form/i }),
      ).not.toBeInTheDocument();
    });

    it('shows form when admin', () => {
      renderAsAdmin();
      expect(
        screen.getByRole('form', { name: /add book form/i }),
      ).toBeInTheDocument();
    });
  });

  describe('admin form', () => {
    it('renders page title', () => {
      renderAsAdmin();
      expect(screen.getByText('Add Book')).toBeInTheDocument();
    });

    it('renders Title field', () => {
      renderAsAdmin();
      expect(screen.getByLabelText(/^title/i)).toBeInTheDocument();
    });

    it('renders Author field', () => {
      renderAsAdmin();
      expect(screen.getByLabelText(/^author/i)).toBeInTheDocument();
    });

    it('renders Year of Publication field', () => {
      renderAsAdmin();
      expect(screen.getByLabelText(/year of publication/i)).toBeInTheDocument();
    });

    it('renders Pages field', () => {
      renderAsAdmin();
      expect(screen.getByLabelText(/^pages/i)).toBeInTheDocument();
    });

    it('renders Language field', () => {
      renderAsAdmin();
      expect(screen.getByLabelText(/^language/i)).toBeInTheDocument();
    });

    it('renders Categories field', () => {
      renderAsAdmin();
      expect(screen.getByText(/^categories$/i)).toBeInTheDocument();
    });

    it('renders the rich text editor', () => {
      renderAsAdmin();
      expect(
        screen.getByRole('textbox', { name: /what i think/i }),
      ).toBeInTheDocument();
    });

    it('renders image upload zone', () => {
      renderAsAdmin();
      expect(
        screen.getByRole('button', { name: /upload image/i }),
      ).toBeInTheDocument();
    });

    it('renders cover constructor preview', () => {
      renderAsAdmin();
      expect(screen.getByTestId('cover')).toBeInTheDocument();
    });

    it('renders Publish submit button', () => {
      renderAsAdmin();
      expect(
        screen.getByRole('button', { name: /publish/i }),
      ).toBeInTheDocument();
    });

    it('renders Reset button', () => {
      renderAsAdmin();
      expect(
        screen.getByRole('button', { name: /reset/i }),
      ).toBeInTheDocument();
    });

    it('shows success screen after a valid submit', async () => {
      renderAsAdmin();
      fillRequired();
      fireEvent.click(screen.getByRole('button', { name: /publish/i }));
      expect(await screen.findByTestId('success-message')).toBeInTheDocument();
      expect(screen.getByText('Book Added!')).toBeInTheDocument();
    });

    it('shows Add Another button after submit', async () => {
      renderAsAdmin();
      fillRequired();
      fireEvent.click(screen.getByRole('button', { name: /publish/i }));
      expect(
        await screen.findByRole('button', { name: /add another/i }),
      ).toBeInTheDocument();
    });

    it('returns to form after Add Another click', async () => {
      renderAsAdmin();
      fillRequired();
      fireEvent.click(screen.getByRole('button', { name: /publish/i }));
      fireEvent.click(await screen.findByRole('button', { name: /add another/i }));
      await waitFor(() =>
        expect(
          screen.getByRole('form', { name: /add book form/i }),
        ).toBeInTheDocument(),
      );
    });

    it('resets title field when Reset is clicked', () => {
      renderAsAdmin();
      fireEvent.change(screen.getByLabelText(/^title/i), {
        target: { value: 'My Book' },
      });
      fireEvent.click(screen.getByRole('button', { name: /reset/i }));
      expect(screen.getByLabelText(/^title/i)).toHaveValue('');
    });
  });
});
