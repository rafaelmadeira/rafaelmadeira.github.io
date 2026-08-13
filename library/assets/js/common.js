export const MANIFEST_URL = 'books/manifest.json';

export function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export async function loadManifest() {
  const response = await fetch(MANIFEST_URL, { cache: 'no-cache' });
  if (!response.ok) {
    throw new Error(`Could not load ${MANIFEST_URL} (${response.status}). Run the manifest builder before serving locally.`);
  }
  return response.json();
}

export function getBook(manifest, slug) {
  return manifest.books.find((book) => book.slug === slug) ?? null;
}

export function bookUrl(slug) {
  return `book.html?book=${encodeURIComponent(slug)}`;
}

export function readerUrl(slug, unit, sectionId = '') {
  const params = new URLSearchParams({
    book: slug,
    file: unit.file,
    unit: unit.id,
  });
  const hash = sectionId ? `#${encodeURIComponent(sectionId)}` : '';
  return `reader.html?${params.toString()}${hash}`;
}

export function featherPath(slug, file) {
  return `books/${encodeURIComponent(slug)}/${encodePath(file)}`;
}

export function featherBasePath(slug, file = '') {
  const parts = String(file).split('/');
  parts.pop();
  const nested = parts.length ? `${parts.map(encodeURIComponent).join('/')}/` : '';
  return `books/${encodeURIComponent(slug)}/${nested}`;
}

export function progressKey(slug) {
  return `writing-library:progress:${slug}`;
}

export function getProgress(slug) {
  try {
    const raw = localStorage.getItem(progressKey(slug));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveProgress(slug, unit) {
  try {
    localStorage.setItem(progressKey(slug), JSON.stringify({
      file: unit.file,
      unit: unit.id,
      openedAt: new Date().toISOString(),
    }));
  } catch {
    // Reading should still work if storage is unavailable.
  }
}

export function unitDisplayName(unit) {
  if (unit.label && unit.title) return `${unit.label}: ${unit.title}`;
  return unit.title || unit.label || humanizeFeatherFilename(unit.file);
}

export function unitTocParts(unit) {
  if (unit.title && unit.label) return { label: unit.label, title: unit.title };
  return { label: '', title: unit.title || unit.label || humanizeFeatherFilename(unit.file) };
}

export function sectionDisplayName(section) {
  if (section.label && section.title) return `${section.label}: ${section.title}`;
  return section.title || section.label || 'Section';
}

export function renderBookCover(book, { large = false, loading = '' } = {}) {
  const title = book.title || 'Untitled Book';
  const largeClass = large ? ' book-cover-large' : '';

  if (book.cover) {
    const loadingAttribute = loading ? ` loading="${escapeHtml(loading)}"` : '';
    return `<img class="book-cover${largeClass}" src="${escapeHtml(book.cover)}" alt="Cover of ${escapeHtml(title)}"${loadingAttribute}>`;
  }

  return `
    <div class="book-cover book-cover-placeholder${largeClass}" role="img" aria-label="No cover has been added for ${escapeHtml(title)}">
      <span class="placeholder-cover-title">${escapeHtml(title)}</span>
      <span class="placeholder-cover-note">No cover yet</span>
    </div>
  `;
}

export function humanizeFeatherFilename(file = '') {
  const stem = String(file).replace(/\.feather$/i, '');
  const withoutOrderPrefix = stem.replace(/^\d+[\s._-]*/, '');
  const words = (withoutOrderPrefix || stem)
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!words) return 'Untitled';
  return words.replace(/\b\p{L}/gu, (letter) => letter.toLocaleUpperCase());
}

export function setDocumentTitle(...parts) {
  document.title = [...parts.filter(Boolean), 'Library'].join(' · ');
}

export function renderError(container, message) {
  container.innerHTML = `
    <section class="error-card" role="alert">
      <p class="eyebrow">Something went wrong</p>
      <h1>Couldn’t load this page</h1>
      <p>${escapeHtml(message)}</p>
      <p><a href="index.html">Return to the library</a></p>
    </section>
  `;
}

function encodePath(file) {
  return String(file).split('/').map(encodeURIComponent).join('/');
}
