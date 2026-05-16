import { FormEvent, useState } from 'react';
import { Button } from 'components';
import { FormField } from '../../components/form-field';
import { useAuth } from '../../contexts/auth-context';
import styles from './login.module.scss';

export const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          find your next <span>read</span>
        </div>

        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to your account to continue</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <FormField
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            required
          />
          <FormField
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            required
          />

          {error && <p className={styles.error}>{error}</p>}

          <Button type="submit" fullWidth size="lg" loading={isLoading}>
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
};
