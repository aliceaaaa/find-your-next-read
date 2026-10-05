const BASE_TITLE = 'Find Your Next Read';
const HOME_TITLE = `${BASE_TITLE} — Personalized Book Recommendations`;
const SITE_URL = 'https://findyournextread.com';

const setMetaTag = (
  attr: 'name' | 'property',
  key: string,
  content: string,
) => {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );

  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }

  el.setAttribute('content', content);
};

const setRobotsMeta = (noindex: boolean) => {
  const el = document.head.querySelector<HTMLMetaElement>(
    'meta[name="robots"]',
  );

  if (!noindex) {
    el?.remove();
    return;
  }

  const tag = el ?? document.createElement('meta');

  tag.setAttribute('name', 'robots');
  tag.setAttribute('content', 'noindex');

  if (!el) {
    document.head.appendChild(tag);
  }
};

const setCanonical = (path: string) => {
  const href = `${SITE_URL}${path === '/' ? '/' : path.replace(/\/+$/, '')}`;
  let el = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );

  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }

  el.setAttribute('href', href);
  setMetaTag('property', 'og:url', href);
};

type DocumentMeta = {
  title?: string;
  description?: string;
  noindex?: boolean;
  path?: string;
};

export const setDocumentMeta = ({
  title,
  description,
  noindex,
  path = window.location.pathname,
}: DocumentMeta) => {
  const fullTitle =
    !title || title === BASE_TITLE ? HOME_TITLE : `${title} · ${BASE_TITLE}`;

  document.title = fullTitle;
  setMetaTag('property', 'og:title', fullTitle);
  setMetaTag('name', 'twitter:title', fullTitle);
  setRobotsMeta(Boolean(noindex));
  setCanonical(path);

  if (description) {
    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:description', description);
    setMetaTag('name', 'twitter:description', description);
  }
};
