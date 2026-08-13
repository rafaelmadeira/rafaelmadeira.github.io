import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { featherOutlineFromSource } from '../assets/js/parser.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const booksDir = path.join(root, 'books');
const coverNames = ['cover.png', 'cover.jpg', 'cover.jpeg', 'cover.webp'];

await fs.mkdir(booksDir, { recursive: true });
const entries = await fs.readdir(booksDir, { withFileTypes: true });
const books = [];

for (const entry of entries) {
  if (!entry.isDirectory() || entry.name.startsWith('.') || entry.name.startsWith('_')) continue;

  const slug = entry.name;
  const dir = path.join(booksDir, slug);
  const metadataPath = path.join(dir, 'book.txt');

  let metadata = {};
  try {
    metadata = parseMetadata(await fs.readFile(metadataPath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn(`${slug}: no book.txt yet; using folder-name defaults`);
    } else {
      throw error;
    }
  }

  const files = await fs.readdir(dir);
  const coverName = findCover(files, metadata.cover);
  if (!coverName) console.warn(`${slug}: no cover image yet; using the built-in placeholder`);

  const featherFiles = files
    .filter((name) => name.toLowerCase().endsWith('.feather'))
    .filter((name) => !name.startsWith('_'))
    .sort(naturalCompare);

  const units = [];
  for (const file of featherFiles) {
    const source = await fs.readFile(path.join(dir, file), 'utf8');
    const outline = featherOutlineFromSource(source, { fallbackTitle: humanizeFeatherFilename(file) });

    for (const unit of outline.units) {
      units.push({
        file,
        id: unit.id,
        kind: unit.kind,
        label: unit.label,
        title: unit.title,
        sections: unit.sections,
      });
    }
  }

  books.push({
    slug,
    title: metadata.title || humanizeSlug(slug),
    author: metadata.author || '',
    started: metadata.started || '',
    status: metadata.status || '',
    description: metadata.description || '',
    cover: coverName ? `books/${slug}/${coverName}` : '',
    units,
  });
}

books.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));

const manifest = {
  format: 'feather',
  version: 2,
  books,
};

await fs.writeFile(path.join(booksDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Built books/manifest.json with ${books.length} book(s).`);

function parseMetadata(source) {
  const result = {};
  for (const rawLine of source.replace(/\r\n?/g, '\n').split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const separator = line.indexOf(':');
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    result[key] = value;
  }
  return result;
}

function naturalCompare(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function findCover(files, configuredCover) {
  if (configuredCover) {
    const match = files.find((name) => name.toLowerCase() === configuredCover.toLowerCase());
    if (match) return match;
    console.warn(`Configured cover “${configuredCover}” was not found; using a placeholder instead`);
  }

  const lowerToActual = new Map(files.map((name) => [name.toLowerCase(), name]));
  for (const candidate of coverNames) {
    if (lowerToActual.has(candidate)) return lowerToActual.get(candidate);
  }
  return '';
}

function humanizeSlug(slug) {
  const words = slug
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!words) return 'Untitled Book';
  return words.replace(/\b\p{L}/gu, (letter) => letter.toLocaleUpperCase());
}

function humanizeFeatherFilename(file) {
  const stem = String(file).replace(/\.feather$/i, '');
  const withoutOrderPrefix = stem.replace(/^\d+[\s._-]*/, '');
  const words = (withoutOrderPrefix || stem)
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!words) return 'Untitled';
  return words.replace(/\b\p{L}/gu, (letter) => letter.toLocaleUpperCase());
}
