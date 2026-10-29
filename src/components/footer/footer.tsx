import { Link } from 'react-router-dom';
import { SUPPORT_URL } from '../../constants';
import { openConsentSettings } from '../../lib';
import styles from './footer.module.scss';

const LINKS = [
  { to: '/pages/who-we-are/', label: 'Who we are' },
  { to: '/pages/about/', label: 'About & Impressum' },
  { to: '/pages/terms/', label: 'Terms' },
  { to: '/pages/privacy/', label: 'Privacy' },
  { to: '/pages/cookies/', label: 'Cookie Policy' },
];

export const Footer = () => (
  <footer className={styles.footer}>
    <span className={styles.copy}>
      © {new Date().getFullYear()} Find your next read
    </span>
    <nav className={styles.links}>
      {LINKS.map((link) => (
        <Link key={link.to} to={link.to} className={styles.link}>
          {link.label}
        </Link>
      ))}
      <a
        href={SUPPORT_URL}
        className={styles.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        Buy us a coffee
      </a>
      <button
        type="button"
        className={styles['link-button']}
        onClick={openConsentSettings}
      >
        Cookie settings
      </button>
    </nav>
  </footer>
);
