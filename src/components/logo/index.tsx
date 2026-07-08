import { NavItemId } from 'types';

import styles from './logo.module.scss';

type LogoProps = {
  onNavChange: (nav: NavItemId) => void;
};

export const Logo = ({ onNavChange }: LogoProps) => (
  <button
    className={styles.logo}
    onClick={() => onNavChange('home')}
    aria-label="Find your next read — home"
  >
    <span className={styles.logoMark}>
      <svg viewBox="0 0 42 59.4" aria-hidden="true">
        <rect width="42" height="59.4" rx="5" fill="currentColor" />
        <rect
          x="0.75"
          y="0.75"
          width="40.5"
          height="57.9"
          rx="4.25"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.24"
          strokeWidth="1.5"
        />
        <rect
          x="13"
          y="8"
          width="16"
          height="2.5"
          rx="1.25"
          fill="#fff"
          fillOpacity="0.65"
        />
        <rect x="8" y="24" width="26" height="4.5" rx="2.25" fill="#fff" />
        <rect x="11" y="31.5" width="20" height="4.5" rx="2.25" fill="#fff" />
        <rect
          x="25"
          y="47"
          width="10"
          height="2.5"
          rx="1.25"
          fill="#fff"
          fillOpacity="0.7"
        />
      </svg>
    </span>
    <span className={styles.logoText}>
      FYN<em>R</em>
    </span>
  </button>
);
