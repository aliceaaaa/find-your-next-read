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
  /** Opens a random book; the button is hidden when not provided. */
  onRandomBook?: () => void;
};

export const Menu = ({
  activeNav,
  isAdmin = false,
  onNavChange,
  onRandomBook,
}: MenuProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  // Sessions from before the user was stored only have a token; still show
  // that someone is signed in.
  const account =
    user ?? (isAuthenticated ? { name: 'Admin', email: '' } : null);

  return (
    <aside className={styles.menu}>
      <Logo onNavChange={onNavChange} />
      <nav>
        {navItems.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={cn(styles['nav-item'], {
              [styles.active]: activeNav === id,
            })}
            onClick={() => onNavChange(id)}
          >
            <Icon className={styles.icon} />
            {label}
          </button>
        ))}
        {onRandomBook && (
          <button
            type="button"
            className={cn(styles['nav-item'], styles.random)}
            onClick={onRandomBook}
          >
            <ShuffleIcon className={styles.icon} />
            Random book
          </button>
        )}
        {isAdmin && (
          <button
            className={cn(styles['nav-item'], {
              [styles.active]: activeNav === 'post-constructor',
            })}
            onClick={() => onNavChange('post-constructor')}
          >
            <PlusCircleIcon className={styles.icon} />
            Add Book
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
