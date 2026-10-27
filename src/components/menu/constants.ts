import { FC } from 'react';
import { NavItemId } from 'types';
import {
  HomeIcon,
  LibraryIcon,
  HeartIcon,
  MessageIcon,
  ConstellationIcon,
  UserIcon,
} from '../../icons';

type NavItem = {
  id: NavItemId;
  label: string;
  shortLabel?: string;
  Icon: FC<{ className?: string }>;
};

export const navItems: NavItem[] = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'library', label: 'Library', Icon: LibraryIcon },
  { id: 'favorites', label: 'Favorites', Icon: HeartIcon },
  { id: 'reviews', label: 'Reviews', Icon: MessageIcon },
  {
    id: 'connections',
    label: 'Connections',
    shortLabel: 'Stars',
    Icon: ConstellationIcon,
  },
  { id: 'who-we-are', label: 'Who we are', shortLabel: 'Us', Icon: UserIcon },
];
