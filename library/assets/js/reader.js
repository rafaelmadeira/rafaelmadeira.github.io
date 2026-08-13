import {
  bookUrl,
  escapeHtml,
  featherBasePath,
  featherPath,
  getBook,
  humanizeFeatherFilename,
  loadManifest,
  readerUrl,
  renderError,
  saveProgress,
  setDocumentTitle,
  unitDisplayName,
} from './common.js';
import { inlineHtml, parseFeather, referencedFootnotes } from './parser.js';

const main = document.querySelector('#reader-main');
const nav = document.querySelector('#chapter-nav');
const bookLink = document.querySelector('#reader-book-link');
const params = new URLSearchParams(location.search);
const slug = params.get('book');
const requestedFile = params.get('file') || params.get('chapter'); // old links still fail gracefully forward.
const requestedUnitId = params.get('unit');

try {
  if (!slug) throw new Error('No book was specified.');

  const manifest = await loadManifest();
  const book = getBook(manifest, slug);
  if (!book) throw new Error(`No book named “${slug}” exists in the manifest.`);

  const units = book.units ?? [];
  if (!units.length) throw new Error('This book does not contain any Feather reading units yet.');

  let manifestUnit = null;
  if (requestedFile && requestedUnitId) {
    manifestUnit = units.find((item) => item.file === requestedFile && item.id === requestedUnitId) ?? null;
  } else if (requestedFile) {
    manifestUnit = units.find((item) => item.file === requestedFile) ?? null;
  } else {
    manifestUnit = units[0];
  }

  if (!manifestUnit) throw new Error('That reading unit does not exist.');

  const response = await fetch(featherPath(slug, manifestUnit.file), { cache: 'no-cache' });
  if (!response.ok) throw new Error(`Could not load ${manifestUnit.file} (${response.status}).`);
  const source = await response.text();
  const parsed = parseFeather(source, { fallbackTitle: humanizeFeatherFilename(manifestUnit.file) });
  const unit = parsed.units.find((item) => item.id === manifestUnit.id) ?? parsed.units[0];
  if (!unit) throw new Error('The Feather file did not contain the expected reading unit. Rebuild the manifest and try again.');

  const basePath = featherBasePath(slug, manifestUnit.file);
  const footnotes = footnotesForUnit(unit, parsed.footnotes);

  saveProgress(slug, manifestUnit);
  setDocumentTitle(unitDisplayName(manifestUnit), book.title);
  bookLink.href = bookUrl(slug);
  bookLink.textContent = book.title;

  main.innerHTML = renderUnit(unit, manifestUnit, footnotes, basePath);
  renderNavigation(book, manifestUnit);
  scrollToRequestedSection();
} catch (error) {
  renderError(main, error.message);
  nav.innerHTML = '';
}

function renderUnit(unit, manifestUnit, footnotes, basePath) {
  const epigraphs = unit.blocks.filter((block) => block.type === 'epigraph');
  const bodyBlocks = unit.blocks.filter((block) => block.type !== 'epigraph');
  const fallbackTitle = !unit.label && !unit.title ? unitDisplayName(manifestUnit) : '';

  return `
    <article class="chapter">
      <header class="chapter-header">
        ${unit.label ? `<p class="chapter-label">${escapeHtml(unit.label)}</p>` : ''}
        ${unit.title ? `<h1>${inlineHtml(unit.title, footnotes, { basePath })}</h1>` : (fallbackTitle ? `<h1>${escapeHtml(fallbackTitle)}</h1>` : '')}
      </header>

      ${epigraphs.length ? `<div class="epigraph-group">${epigraphs.map((block) => renderBlock(block, footnotes, basePath)).join('')}</div>` : ''}

      <div class="prose">
        ${bodyBlocks.map((block) => renderBlock(block, footnotes, basePath)).join('')}
      </div>

      ${renderFootnotes(footnotes, basePath)}
    </article>
  `;
}

function renderBlock(block, footnotes, basePath) {
  const inline = (value) => inlineHtml(value, footnotes, { basePath });

  switch (block.type) {
    case 'paragraph':
      return `<p>${inline(block.text)}</p>`;
    case 'sceneBreak':
      return '<div class="scene-break" aria-label="Scene break"><span>⁂</span></div>';
    case 'sectionHeading':
      return `
        <div class="section-heading" id="${escapeHtml(block.id)}">
          ${block.title ? `<p class="section-label">${escapeHtml(block.label)}</p><h2>${inline(block.title)}</h2>` : `<h2>${escapeHtml(block.label)}</h2>`}
        </div>
      `;
    case 'epigraph':
      return `
        <blockquote class="epigraph">
          ${renderIndentedLines(block.lines, inline)}
          ${block.attribution ? `<footer>— ${inline(block.attribution)}</footer>` : ''}
        </blockquote>
      `;
    case 'extract':
      return `<blockquote class="extract">${renderExtractLines(block.lines, inline)}</blockquote>`;
    case 'image':
      return `<figure class="feather-figure">${inline(block.markdown)}</figure>`;
    case 'list': {
      const tag = block.ordered ? 'ol' : 'ul';
      return `<${tag} class="prose-list">${block.items.map((item) => `<li>${inline(item)}</li>`).join('')}</${tag}>`;
    }
    case 'code': {
      const language = String(block.language || '').replace(/[^A-Za-z0-9_+-]/g, '');
      const className = language ? ` class="language-${escapeHtml(language)}"` : '';
      return `<pre class="code-block"><code${className}>${escapeHtml(block.text)}</code></pre>`;
    }
    case 'table':
      return renderTable(block, inline);
    default:
      return '';
  }
}

function renderIndentedLines(lines, inline) {
  return splitLineParagraphs(lines)
    .map((paragraph) => `<p>${paragraph.map(inline).join('<br>')}</p>`)
    .join('');
}

function renderExtractLines(lines, inline) {
  return splitLineParagraphs(lines)
    .map((paragraph) => `<p>${paragraph.map(inline).join('<br>')}</p>`)
    .join('');
}

function splitLineParagraphs(lines) {
  const paragraphs = [];
  let current = [];

  for (const line of lines) {
    if (!String(line).trim()) {
      if (current.length) paragraphs.push(current);
      current = [];
    } else {
      current.push(line);
    }
  }
  if (current.length) paragraphs.push(current);
  return paragraphs;
}

function renderTable(block, inline) {
  const headingCells = block.headers.map((cell, index) => {
    const alignment = block.alignments[index];
    const align = alignment ? ` style="text-align:${alignment}"` : '';
    return `<th scope="col"${align}>${inline(cell)}</th>`;
  }).join('');

  const rows = block.rows.map((row) => `
    <tr>${row.map((cell, index) => {
      const alignment = block.alignments[index];
      const align = alignment ? ` style="text-align:${alignment}"` : '';
      return `<td${align}>${inline(cell)}</td>`;
    }).join('')}</tr>
  `).join('');

  return `
    <div class="table-scroll" tabindex="0" role="region" aria-label="Scrollable table">
      <table class="prose-table">
        <thead><tr>${headingCells}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function footnotesForUnit(unit, allFootnotes) {
  const ids = referencedFootnotes(unit.blocks);
  return Object.fromEntries(ids.filter((id) => id in allFootnotes).map((id) => [id, allFootnotes[id]]));
}

function renderFootnotes(footnotes, basePath) {
  const entries = Object.entries(footnotes);
  if (!entries.length) return '';

  return `
    <section class="footnotes" aria-labelledby="notes-heading">
      <h2 id="notes-heading">Notes</h2>
      <ol>
        ${entries.map(([id, text]) => {
          const safeId = String(id).toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
          return `<li id="note-${safeId}">${inlineHtml(text, footnotes, { basePath })} <a class="footnote-back" href="#ref-${safeId}" aria-label="Back to reference">↩</a></li>`;
        }).join('')}
      </ol>
    </section>
  `;
}

function renderNavigation(book, current) {
  const units = book.units ?? [];
  const index = units.findIndex((unit) => unit.file === current.file && unit.id === current.id);
  const previous = index > 0 ? units[index - 1] : null;
  const next = index >= 0 && index < units.length - 1 ? units[index + 1] : null;

  nav.innerHTML = `
    <div class="chapter-nav-slot chapter-nav-previous">
      ${previous ? `<a href="${readerUrl(book.slug, previous)}"><span class="nav-direction">← Previous</span><span>${escapeHtml(unitDisplayName(previous))}</span></a>` : ''}
    </div>
    <div class="chapter-nav-slot chapter-nav-contents">
      <a href="${bookUrl(book.slug)}"><span class="nav-direction">Contents</span><span>${escapeHtml(book.title)}</span></a>
    </div>
    <div class="chapter-nav-slot chapter-nav-next">
      ${next ? `<a href="${readerUrl(book.slug, next)}"><span class="nav-direction">Next →</span><span>${escapeHtml(unitDisplayName(next))}</span></a>` : ''}
    </div>
  `;
}

function scrollToRequestedSection() {
  if (!location.hash) return;
  const id = decodeURIComponent(location.hash.slice(1));
  requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
}
