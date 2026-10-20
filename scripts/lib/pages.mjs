import { readFile } from 'node:fs/promises';

const PAGE_META_URL = new URL(
  '../../src/constants/page-meta.json',
  import.meta.url,
);

// The library and static pages, with the titles and descriptions the app
// uses. Like book pages they are prerendered as {path}index.html, so the
// trailing slash is part of the canonical URL (the slash-less one redirects).
export const loadStaticPages = async () => {
  const meta = JSON.parse(await readFile(PAGE_META_URL, 'utf8'));

  return [
    { path: '/library/', ...meta.library },
    ...Object.entries(meta.pages).map(([slug, page]) => ({
      path: `/pages/${slug}/`,
      ...page,
    })),
  ];
};
