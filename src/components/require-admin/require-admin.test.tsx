import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/auth-context';
import { RequireAdmin } from './require-admin';

const renderWith = (admin: boolean) => {
  localStorage.clear();
  if (admin) {
    localStorage.setItem(
      'auth_user',
      JSON.stringify({ id: 1, name: 'Admin', email: 'admin@example.com' }),
    );
  }
  return render(
    <MemoryRouter>
      <AuthProvider>
        <RequireAdmin>
          <div>protected content</div>
        </RequireAdmin>
      </AuthProvider>
    </MemoryRouter>,
  );
};

describe('RequireAdmin', () => {
  it('renders children when admin', () => {
    renderWith(true);
    expect(screen.getByText('protected content')).toBeInTheDocument();
  });

  it('does not render children when not admin', () => {
    renderWith(false);
    expect(screen.queryByText('protected content')).not.toBeInTheDocument();
  });
});
