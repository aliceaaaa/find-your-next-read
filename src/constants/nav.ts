import { NavItemId } from 'types';

export const navPathMap: Record<
  Exclude<NavItemId, 'categories' | 'reviews'>,
  string
> = {
  home: '/',
  search: '/search',
  library: '/library',
  favorites: '/favorites',
  profile: '/profile',
  settings: '/settings',
  'post-constructor': '/create-post',
  'admin-books': '/admin/books',
};

export const navFromPath = (pathname: string): NavItemId => {
  if (pathname.startsWith('/admin')) {
    return 'admin-books';
  }
  if (pathname === '/search') {
    return 'search';
  }
  if (pathname === '/library') {
    return 'library';
  }
  if (pathname === '/favorites') {
    return 'favorites';
  }
  if (pathname === '/profile') {
    return 'profile';
  }
  if (pathname === '/settings') {
    return 'settings';
  }
  if (pathname === '/create-post') {
    return 'post-constructor';
  }
  return 'home';
};
