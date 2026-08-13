import {
  escapeHtml,
  getBook,
  getProgress,
  loadManifest,
  readerUrl,
  renderBookCover,
  renderError,
  sectionDisplayName,
  setDocumentTitle,
  unitDisplayName,
  unitTocParts,
} from './common.js';

const main = document.querySelector('#book-main');
const params = new URLSearchParams(location.search);
const slug = params.get('book');

try {
  if (!slug) throw new Error('No book was specified.');

  const manifest = await loadManifest();
  const book = getBook(manifest, slug);
  if (!book) throw new Error(`No book named “${slug}” exists in the manifest.`);

  setDocumentTitle(book.title);

  const units = book.units ?? [];
  const progress = getProgress(slug);
  const progressUnit = progress
    ? units.find((unit) => unit.file === progress.file && unit.id === progress.unit) ?? null
    : null;
  const firstUnit = units[0] ?? null;
  const targetUnit = progressUnit || firstUnit;
  const actionLabel = progressUnit ? 'Continue reading' : 'Start reading';

  const tocItems = units.map((unit) => {
    const isLastOpened = progressUnit?.file === unit.file && progressUnit?.id === unit.id;
    const parts = unitTocParts(unit);
    const sectionItems = (unit.sections ?? []).map((section) => `
      <li class="toc-section-item">
        <a href="${readerUrl(slug, unit, section.id)}">
          <span>${escapeHtml(sectionDisplayName(section))}</span>
        </a>
      </li>
    `).join('');

    return `
      <li class="toc-item toc-kind-${escapeHtml(unit.kind || 'document')}${isLastOpened ? ' is-current' : ''}">
        <a href="${readerUrl(slug, unit)}">
          <span class="toc-label">${escapeHtml(parts.label)}</span>
          <span class="toc-title">${escapeHtml(parts.title)}</span>
          ${isLastOpened ? '<span class="toc-progress">Last opened</span>' : ''}
        </a>
      </li>
      ${sectionItems}
    `;
  }).join('');

  const meta = [
    book.author ? `By ${escapeHtml(book.author)}` : '<span class="is-placeholder">Author not set</span>',
    book.started ? `Started ${escapeHtml(book.started)}` : '',
    book.status ? escapeHtml(book.status) : '',
  ].filter(Boolean).join(' · ');

  main.innerHTML = `
    <article class="book-contents">
      <div class="book-hero">
        <div class="book-hero-cover">
          ${renderBookCover(book, { large: true })}
        </div>
        <div class="book-hero-copy">
          <p class="eyebrow">Book</p>
          <h1>${escapeHtml(book.title)}</h1>
          ${meta ? `<p class="book-meta">${meta}</p>` : ''}
          <p class="book-description${book.description ? '' : ' is-placeholder'}">${book.description ? escapeHtml(book.description) : 'No description yet.'}</p>
          ${targetUnit ? `<a class="button" href="${readerUrl(slug, targetUnit)}">${actionLabel}</a>` : '<p class="empty-state">No reading content yet. Add a <code>.feather</code> file to this folder when you’re ready to start writing.</p>'}
        </div>
      </div>

      <section class="toc" aria-labelledby="toc-title">
        <div class="toc-heading">
          <p class="eyebrow">Contents</p>
          <h2 id="toc-title">Table of contents</h2>
        </div>
        <ol class="toc-list">
          ${tocItems || '<li class="empty-state toc-empty">No Feather files found yet.</li>'}
        </ol>
      </section>
    </article>
  `;
} catch (error) {
  renderError(main, error.message);
}
