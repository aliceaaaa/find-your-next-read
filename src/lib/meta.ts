const BASE_TITLE = 'Find your next read';

const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);

  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }

  el.setAttribute('content', content);
};

type DocumentMeta = {
  title?: string;
  description?: string;
};

/**
 * Set the page <title>, meta description and matching Open Graph tags.
 * Titles are suffixed with the site name unless they already are it.
 */
export const setDocumentMeta = ({ title, description }: DocumentMeta) => {
  const fullTitle =
    !title || title === BASE_TITLE ? BASE_TITLE : `${title} · ${BASE_TITLE}`;

  document.title = fullTitle;
  setMetaTag('property', 'og:title', fullTitle);

  if (description) {
    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:description', description);
  }
};
