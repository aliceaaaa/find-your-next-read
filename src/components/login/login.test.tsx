import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/auth-context';
import * as api from 'api';
import { Login } from './login';

jest.mock('api');

const renderLogin = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>,
  );

describe('Login', () => {
  beforeEach(() => localStorage.clear());

  it('renders email and password fields', () => {
    renderLogin();
    expect(screen.getByPlaceholderText(/you@example/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('renders the sign in button', () => {
    renderLogin();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows an error on invalid credentials', async () => {
    (api.apiLogin as jest.Mock).mockRejectedValueOnce(new Error('bad'));
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/you@example/i), {
      target: { value: 'a@b.c' },
    });
    fireEvent.change(screen.getByPlaceholderText('••••••••'), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() =>
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument(),
    );
  });
});
