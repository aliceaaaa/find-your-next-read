import { useState, useEffect } from 'react';

export const useBookmarks = () => {
  const BOOKMARKS_KEY = 'bookmarks';

  const readBookmarks = (): Record<number, boolean> => {
    try {
      return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '{}');
    } catch {
      return {};
    }
  };

  const [bookmarks, setBookmarks] =
    useState<Record<number, boolean>>(readBookmarks);

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  return { bookmarks, setBookmarks };
};
