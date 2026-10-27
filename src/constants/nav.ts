import { NavItemId } from 'types';

export const navPathMap: Record<NavItemId, string> = {
  home: '/',
  library: '/library/',
  favorites: '/favorites',
  reviews: '/reviews',
  connections: '/connections',
  'who-we-are': '/pages/who-we-are/',
  'post-constructor': '/create-post',
};

export const normalizePathname = (pathname: string) =>
  pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

export const navFromPath = (pathname: string): NavItemId => {
  const path = normalizePathname(pathname);

  if (path === '/library') {
    return 'library';
  }
  if (path === '/favorites') {
    return 'favorites';
  }
  if (path === '/reviews') {
    return 'reviews';
  }
  if (path === '/connections') {
    return 'connections';
  }
  if (path === '/pages/who-we-are') {
    return 'who-we-are';
  }
  if (path === '/create-post') {
    return 'post-constructor';
  }
  return 'home';
};
