import { FC } from 'react';
import { NavItemId } from 'types';
import { HomeIcon, LibraryIcon, HeartIcon } from '../../icons';

type NavItem = {
  id: NavItemId;
  label: string;
  Icon: FC<{ className?: string }>;
};

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'library', label: 'Library', Icon: LibraryIcon },
  { id: 'favorites', label: 'Favorites', Icon: HeartIcon },
];
