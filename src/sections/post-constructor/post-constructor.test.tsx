import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider } from '../../contexts/auth-context';
import { PostConstructor } from './post-constructor';

const renderDefault = () => {
  localStorage.clear();
  render(
    <AuthProvider>
      <PostConstructor />
    </AuthProvider>,
  );
};

const renderAsAdmin = () => {
  localStorage.clear();
  localStorage.setItem(
    'auth_user',
    JSON.stringify({ id: 1, name: 'Admin', email: 'admin@example.com' }),
  );
  render(
    <AuthProvider>
      <PostConstructor />
    </AuthProvider>,
  );
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
        screen.queryByRole('form', { name: /create book post/i }),
      ).not.toBeInTheDocument();
    });

    it('shows form when admin', () => {
      renderAsAdmin();
      expect(
        screen.getByRole('form', { name: /create book post form/i }),
      ).toBeInTheDocument();
    });
  });

  describe('admin form', () => {
    it('renders page title', () => {
      renderAsAdmin();
      expect(screen.getByText('Create Book Post')).toBeInTheDocument();
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
      expect(screen.getByLabelText(/^categories/i)).toBeInTheDocument();
    });

    it('renders the rich text editor', () => {
      renderAsAdmin();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
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

    it('renders Create Post submit button', () => {
      renderAsAdmin();
      expect(
        screen.getByRole('button', { name: /create post/i }),
      ).toBeInTheDocument();
    });

    it('renders Reset button', () => {
      renderAsAdmin();
      expect(
        screen.getByRole('button', { name: /reset/i }),
      ).toBeInTheDocument();
    });

    it('shows success screen after form submit', () => {
      renderAsAdmin();
      fireEvent.click(screen.getByRole('button', { name: /create post/i }));
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
      expect(screen.getByText('Post Created!')).toBeInTheDocument();
    });

    it('shows Create Another button after submit', () => {
      renderAsAdmin();
      fireEvent.click(screen.getByRole('button', { name: /create post/i }));
      expect(
        screen.getByRole('button', { name: /create another/i }),
      ).toBeInTheDocument();
    });

    it('returns to form after Create Another click', () => {
      renderAsAdmin();
      fireEvent.click(screen.getByRole('button', { name: /create post/i }));
      fireEvent.click(screen.getByRole('button', { name: /create another/i }));
      expect(
        screen.getByRole('form', { name: /create book post form/i }),
      ).toBeInTheDocument();
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
