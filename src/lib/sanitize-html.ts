const ALLOWED_TAGS = new Set([
  'P',
  'BR',
  'B',
  'STRONG',
  'I',
  'EM',
  'U',
  'UL',
  'OL',
  'LI',
]);

const DROPPED_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'IFRAME',
  'OBJECT',
  'TEMPLATE',
]);

const escapeHtml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const cleanNode = (node: Node, doc: Document): Node[] => {
  if (node.nodeType === Node.TEXT_NODE) {
    return [doc.createTextNode(node.textContent ?? '')];
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return [];
  }

  const el = node as Element;

  if (DROPPED_TAGS.has(el.tagName)) {
    return [];
  }

  const children = Array.from(el.childNodes).flatMap((child) =>
    cleanNode(child, doc),
  );

  if (!ALLOWED_TAGS.has(el.tagName)) {
    return children;
  }

  const clean = doc.createElement(el.tagName.toLowerCase());
  children.forEach((child) => clean.appendChild(child));

  return [clean];
};

export const sanitizeHtml = (html: string): string => {
  if (typeof DOMParser === 'undefined') {
    return escapeHtml(html.replace(/<[^>]*>/g, ''));
  }

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const out = doc.createElement('div');

  Array.from(doc.body.childNodes)
    .flatMap((child) => cleanNode(child, doc))
    .forEach((child) => out.appendChild(child));

  return out.innerHTML;
};
