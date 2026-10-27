import { readFile } from 'node:fs/promises';

const PAGE_META_URL = new URL(
  '../../src/constants/page-meta.json',
  import.meta.url,
);

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
