import cn from 'classnames';
import { NavItemId } from 'types';
import { LogOutIcon, PlusCircleIcon, ShuffleIcon } from '../../icons';
import { useAuth } from '../../contexts/auth-context';
import { navItems } from './constants';
import styles from './menu.module.scss';
import { Logo } from 'components/logo';

type MenuProps = {
  activeNav: NavItemId;
  isAdmin?: boolean;
  onNavChange: (id: NavItemId) => void;
  onRandomBook?: () => void;
};

const NavLabel = ({ label, short }: { label: string; short?: string }) => (
  <>
    <span className={cn({ [styles['long-label']]: short })}>{label}</span>
    {short && <span className={styles['short-label']}>{short}</span>}
  </>
);

export const Menu = ({
  activeNav,
  isAdmin = false,
  onNavChange,
  onRandomBook,
}: MenuProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const account =
    user ?? (isAuthenticated ? { name: 'Admin', email: '' } : null);

  return (
    <aside className={styles.menu}>
      <Logo onNavChange={onNavChange} />
      <nav>
        {navItems.map(({ id, label, shortLabel, Icon }) => (
          <button
            key={id}
            aria-label={label}
            className={cn(styles['nav-item'], {
              [styles.active]: activeNav === id,
            })}
            onClick={() => onNavChange(id)}
          >
            <Icon className={styles.icon} />
            <NavLabel label={label} short={shortLabel} />
          </button>
        ))}
        {onRandomBook && (
          <button
            type="button"
            className={cn(styles['nav-item'], styles.random)}
            onClick={onRandomBook}
            aria-label="Random book"
          >
            <ShuffleIcon className={styles.icon} />
            <NavLabel label="Random book" short="Random" />
          </button>
        )}
        {isAdmin && (
          <button
            className={cn(styles['nav-item'], {
              [styles.active]: activeNav === 'post-constructor',
            })}
            onClick={() => onNavChange('post-constructor')}
            aria-label="Add Book"
          >
            <PlusCircleIcon className={styles.icon} />
            <NavLabel label="Add Book" short="Add" />
          </button>
        )}
      </nav>
      {account && (
        <div className={styles.user}>
          <div className={styles.avatar}>{account.name[0]}</div>
          <div className={styles.info}>
            <div className={styles.name}>{account.name}</div>
            {account.email && (
              <div className={styles.email}>{account.email}</div>
            )}
          </div>
          <button
            type="button"
            className={styles['admin-toggle']}
            onClick={() => {
              logout();
              onNavChange('home');
            }}
            aria-label="Log out"
            title="Log out"
          >
            <LogOutIcon size={16} />
          </button>
        </div>
      )}
    </aside>
  );
};
