import { FC, Fragment } from 'react';
import cn from 'classnames';
import { NavItemId } from 'types';
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  HeartIcon,
  UserIcon,
  SettingsIcon,
  PlusCircleIcon,
} from '../../icons';
import { users } from '../../data/mock-data';
import styles from './menu.module.scss';

type MenuProps = {
  activeNav: NavItemId;
  isAdmin?: boolean;
  onNavChange: (id: NavItemId) => void;
};

const NAV_ITEMS: {
  id: NavItemId;
  label: string;
  Icon: FC<{ className?: string }>;
}[] = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'search', label: 'Search', Icon: SearchIcon },
  { id: 'library', label: 'Library', Icon: LibraryIcon },
  { id: 'favorites', label: 'Favorites', Icon: HeartIcon },
  { id: 'profile', label: 'Profile', Icon: UserIcon },
  { id: 'settings', label: 'Settings', Icon: SettingsIcon },
];

export const Menu = ({
  activeNav,
  isAdmin = false,
  onNavChange,
}: MenuProps) => (
  <aside className={styles.menu}>
    <nav>
      {NAV_ITEMS.map(({ id, label, Icon }) => (
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
      {isAdmin && (
        <button
          className={cn(styles['nav-item'], {
            [styles.active]: activeNav === 'post-constructor',
          })}
          onClick={() => onNavChange('post-constructor')}
        >
          <PlusCircleIcon className={styles.icon} />
          Create Post
        </button>
      )}
    </nav>
    <div className={styles.user}>
      {users.map((user) => (
        <Fragment key={user.id}>
          <div className={styles.avatar}>{user.avatar}</div>
          <div className={styles.info}>
            <div className={styles.name}>{user.name}</div>
            <div className={styles.email}>{user.email}</div>
          </div>
        </Fragment>
      ))}
    </div>
  </aside>
);
