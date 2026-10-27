import { readFile, writeFile } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';

const PUBLIC_DIR = new URL('../public/', import.meta.url);

const ICONS = [
  { file: 'logo192.png', size: 192 },
  { file: 'logo512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180, background: '#ffffff', scale: 0.78 },
  { file: 'og-image.png', size: 200, background: '#ffffff', scale: 0.72 },
];

const main = async () => {
  const source = await readFile(new URL('favicon.svg', PUBLIC_DIR), 'utf8');
  const viewBox = source.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 64 64';
  const [, , width, height] = viewBox.split(/\s+/).map(Number);
  const inner = source
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '');

  for (const { file, size, background, scale = 1 } of ICONS) {
    const cx = width / 2;
    const cy = height / 2;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${
      background
        ? `<rect width="${width}" height="${height}" fill="${background}"/>`
        : ''
    }<g transform="translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})">${inner}</g></svg>`;

    const png = new Resvg(svg, { fitTo: { mode: 'width', value: size } })
      .render()
      .asPng();

    await writeFile(new URL(file, PUBLIC_DIR), png);
    console.log(`${file}: ${size}×${size}`);
  }
};

main();
