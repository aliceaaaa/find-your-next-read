import { NavItemId } from 'types';

export const navPathMap: Record<NavItemId, string> = {
  home: '/',
  library: '/library',
  favorites: '/favorites',
  'post-constructor': '/create-post',
};

export const navFromPath = (pathname: string): NavItemId => {
  if (pathname === '/library') {
    return 'library';
  }
  if (pathname === '/favorites') {
    return 'favorites';
  }
  if (pathname === '/create-post') {
    return 'post-constructor';
  }
  return 'home';
};
