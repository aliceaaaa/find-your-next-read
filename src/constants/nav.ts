import { NavItemId } from 'types';

export const navPathMap: Record<NavItemId, string> = {
  home: '/',
  library: '/library/',
  favorites: '/favorites',
  reviews: '/reviews',
  'who-we-are': '/pages/who-we-are/',
  'post-constructor': '/create-post',
};

// Prerendered pages are served with a trailing slash ("/library/"), routes
// are matched without one.
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
  if (path === '/pages/who-we-are') {
    return 'who-we-are';
  }
  if (path === '/create-post') {
    return 'post-constructor';
  }
  return 'home';
};
