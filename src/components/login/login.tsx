import { FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth-context';
import { Button } from '../button';
import { Input } from '../input';
import styles from './login.module.scss';

export const Login = () => {
  const navigate = useNavigate();
  const { isAdmin, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAdmin) {
    return <Navigate to="/admin/books" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate('/admin/books', { replace: true });
    } catch {
      setError('Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Admin sign in</h1>
        <p className={styles.subtitle}>Sign in to manage books and reviews.</p>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="login-email">
            Email
          </label>
          <Input
            id="login-email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            required
            autoFocus
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="login-password">
            Password
          </label>
          <Input
            id="login-password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            required
          />
        </div>

        {error && (
          <span className={styles.error} role="alert">
            {error}
          </span>
        )}

        <Button type="submit" loading={submitting} fullWidth>
          Sign in
        </Button>
      </form>
    </div>
  );
};
