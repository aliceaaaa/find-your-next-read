import { FC } from 'react';
import { NavItemId } from 'types';
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  HeartIcon,
  UserIcon,
  SettingsIcon,
} from '../../icons';

type NavItem = {
  id: NavItemId;
  label: string;
  Icon: FC<{ className?: string }>;
};

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'search', label: 'Search', Icon: SearchIcon },
  { id: 'library', label: 'Library', Icon: LibraryIcon },
  { id: 'favorites', label: 'Favorites', Icon: HeartIcon },
  { id: 'profile', label: 'Profile', Icon: UserIcon },
  { id: 'settings', label: 'Settings', Icon: SettingsIcon },
];
