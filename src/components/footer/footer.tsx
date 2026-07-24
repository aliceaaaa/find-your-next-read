import { Link } from 'react-router-dom';
import styles from './footer.module.scss';

const LINKS = [
  { to: '/pages/about', label: 'About & Impressum' },
  { to: '/pages/terms', label: 'Terms' },
  { to: '/pages/privacy', label: 'Privacy' },
  { to: '/pages/cookies', label: 'Cookie Policy' },
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
    </nav>
  </footer>
);
