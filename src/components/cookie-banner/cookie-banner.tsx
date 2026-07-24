import { useState } from 'react';
import { Link } from 'react-router-dom';
import { track } from '../../lib';
import styles from './cookie-banner.module.scss';

const CONSENT_KEY = 'cookie_consent';

export const CookieBanner = () => {
  const [visible, setVisible] = useState(
    () => !localStorage.getItem(CONSENT_KEY),
  );

  if (!visible) {
    return null;
  }

  const choose = (choice: 'accepted' | 'declined') => {
    localStorage.setItem(CONSENT_KEY, choice);
    track('cookie_consent', { choice });
    setVisible(false);
  };

  return (
    <div className={styles.banner} role="dialog" aria-label="Cookie notice">
      <p className={styles.text}>
        We use cookies to improve your experience. See our{' '}
        <Link to="/pages/cookies" className={styles.link}>
          Cookie Policy
        </Link>
        .
      </p>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.decline}
          onClick={() => choose('declined')}
        >
          Decline
        </button>
        <button
          type="button"
          className={styles.accept}
          onClick={() => choose('accepted')}
        >
          Accept
        </button>
      </div>
    </div>
  );
};
