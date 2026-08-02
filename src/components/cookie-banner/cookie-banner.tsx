import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import {
  ConsentChoice,
  ConsentSource,
  getConsent,
  setConsent,
  subscribeConsentSettings,
} from '../../lib';
import styles from './cookie-banner.module.scss';

export const CookieBanner = () => {
  const [isOpen, setIsOpen] = useState(() => getConsent() === null);
  const [isDetailed, setIsDetailed] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [source, setSource] = useState<ConsentSource>('banner_first');

  useEffect(
    () =>
      subscribeConsentSettings(() => {
        const stored = getConsent();
        setAnalytics(stored?.analytics === true);
        setMarketing(stored?.marketing === true);
        setSource('banner_reopen');
        setIsDetailed(true);
        setIsOpen(true);
      }),
    [],
  );

  if (!isOpen) {
    return null;
  }

  const save = (choice: ConsentChoice) => {
    setConsent(choice, source);
    setIsOpen(false);
    setIsDetailed(false);
  };

  return (
    <section
      className={styles.banner}
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-text"
    >
      <h2 className={styles.title} id="cookie-banner-title">
        Cookie settings
      </h2>
      <p className={styles.text} id="cookie-banner-text">
        We use necessary cookies to run this site. Analytics and marketing
        cookies are only used if you allow them — nothing is loaded before you
        choose. You can change your choice at any time via “Cookie settings” in
        the footer. See our{' '}
        <Link to="/pages/cookies" className={styles.link}>
          Cookie Policy
        </Link>
        .
      </p>

      {isDetailed && (
        <div className={styles.options}>
          <label className={cn(styles.option, styles.locked)}>
            <input type="checkbox" checked disabled readOnly />
            <span className={styles['option-text']}>
              <strong>Necessary</strong>
              Needed for the site to work. Always active.
            </span>
          </label>
          <label className={styles.option}>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(event) => setAnalytics(event.target.checked)}
            />
            <span className={styles['option-text']}>
              <strong>Analytics</strong>
              Google Analytics 4 — how the site is used, in aggregate.
            </span>
          </label>
          <label className={styles.option}>
            <input
              type="checkbox"
              checked={marketing}
              onChange={(event) => setMarketing(event.target.checked)}
            />
            <span className={styles['option-text']}>
              <strong>Marketing</strong>
              Ad measurement and personalised advertising.
            </span>
          </label>
        </div>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.choice}
          onClick={() => save({ analytics: false, marketing: false })}
        >
          Reject all
        </button>
        <button
          type="button"
          className={styles.choice}
          onClick={() => save({ analytics: true, marketing: true })}
        >
          Accept all
        </button>
      </div>

      <div className={styles.secondary}>
        {!isDetailed && (
          <button
            type="button"
            className={styles['text-button']}
            onClick={() => setIsDetailed(true)}
          >
            Manage individually
          </button>
        )}
        {isDetailed && (
          <button
            type="button"
            className={styles['text-button']}
            onClick={() => save({ analytics, marketing })}
          >
            Save selection
          </button>
        )}
      </div>
    </section>
  );
};
