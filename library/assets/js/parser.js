// Feather: plain-text manuscript syntax for books.
//
// Core structure is manuscript-like rather than Markdown-like:
//   CHAPTER / PART / BOOK / VOLUME / named divisions
//   SECTION for internal subheadings
//   # for a scene/thematic break
//   indentation for epigraphs (before body prose) and extracts (after it)
//
// Familiar Markdown syntax is supported where Feather has no native
// manuscript convention: links, images, lists, code, footnotes, and tables.

const ATTRIBUTION_RE = /^(?:--|—|–)\s*(.+)$/;
const FOOTNOTE_DEF_RE = /^\[\^([^\]]+)\]:\s*(.+)$/;
const FENCE_RE = /^```\s*([A-Za-z0-9_+-]*)\s*$/;
const UNORDERED_LIST_RE = /^\s*[-*+]\s+(.+)$/;
const ORDERED_LIST_RE = /^\s*\d+[.)]\s+(.+)$/;
const STANDALONE_IMAGE_RE = /^!\[([^\]]*)\]\((\S+?)(?:\s+["']([^"']+)["'])?\)\s*$/;

const READING_KINDS = new Set([
  'volume',
  'book',
  'part',
  'chapter',
  'prologue',
  'epilogue',
  'introduction',
  'preface',
  'afterword',
  'interlude',
  'appendix',
]);

const STRUCTURAL_RE = /^(VOLUME|BOOK|PART|CHAPTER|SECTION|PROLOGUE|EPILOGUE|INTRODUCTION|PREFACE|AFTERWORD|INTERLUDE|APPENDIX)(?:\s+(.+?))?$/i;

export function parseFeather(source, { fallbackTitle = 'Untitled' } = {}) {
  const normalized = String(source ?? '').replace(/\r\n?/g, '\n');
  const { lines, footnotes } = extractFootnotes(normalized.split('\n'));
  const units = [];
  const usedUnitIds = new Set();

  let documentTitle = '';
  let current = null;
  let cursor = 0;
  let inFence = false;
  let sawStructure = false;

  const finishCurrent = () => {
    if (!current) return;
    const blocks = parseBlocks(current.tokens);
    const sections = blocks
      .filter((block) => block.type === 'sectionHeading')
      .map(({ id, label, title }) => ({ id, label, title }));

    units.push({
      id: current.id,
      kind: current.kind,
      label: current.label,
      title: current.title,
      blocks,
      sections,
    });
    current = null;
  };

  const ensureImplicitUnit = () => {
    if (current) return;
    const title = documentTitle || fallbackTitle || 'Untitled';
    current = {
      id: uniqueId(slugifyId(title) || 'document', usedUnitIds),
      kind: 'document',
      label: '',
      title,
      tokens: [],
    };
  };

  while (cursor < lines.length) {
    const line = lines[cursor];
    const fence = line.match(FENCE_RE);

    if (!inFence) {
      const structural = readStructuralHeading(lines, cursor);
      if (structural) {
        sawStructure = true;

        if (structural.kind === 'section') {
          ensureImplicitUnit();
          current.tokens.push({ type: 'section', heading: structural });
        } else if (READING_KINDS.has(structural.kind)) {
          finishCurrent();
          current = {
            id: uniqueId(unitBaseId(structural), usedUnitIds),
            kind: structural.kind,
            label: structural.label,
            title: structural.title,
            tokens: [],
          };
        }

        cursor += structural.consumed;
        continue;
      }

      if (!current && !documentTitle && !sawStructure && looksLikeLeadingDocumentTitle(lines, cursor)) {
        documentTitle = line.trim();
        cursor += 1;
        continue;
      }
    }

    if (!current && line.trim()) ensureImplicitUnit();
    if (current) current.tokens.push({ type: 'line', text: line });

    if (fence) inFence = !inFence;
    cursor += 1;
  }

  finishCurrent();

  // An empty .feather file is still a useful draft unit in a folder-based book.
  if (!units.length) {
    const title = documentTitle || fallbackTitle || 'Untitled';
    units.push({
      id: uniqueId(slugifyId(title) || 'document', usedUnitIds),
      kind: 'document',
      label: '',
      title,
      blocks: [],
      sections: [],
    });
  }

  return {
    documentTitle,
    units,
    footnotes,
  };
}

export function featherOutlineFromSource(source, options = {}) {
  const parsed = parseFeather(source, options);
  return {
    documentTitle: parsed.documentTitle,
    units: parsed.units.map(({ id, kind, label, title, sections }) => ({
      id,
      kind,
      label,
      title,
      sections,
    })),
  };
}

export function inlineHtml(input, footnotes = {}, { basePath = '' } = {}) {
  const tokens = [];
  let text = String(input ?? '');

  const stash = (html) => {
    const marker = `@@FTTOKEN${tokens.length}@@`;
    tokens.push(html);
    return marker;
  };

  // Inline code is stashed first so Markdown-like marks inside it stay literal.
  text = text.replace(/`([^`]+)`/g, (_, code) => stash(`<code>${escapeText(code)}</code>`));

  // Images use standard Markdown notation. Relative paths are resolved against
  // the current Feather file's containing book folder by the reader.
  text = text.replace(/!\[([^\]]*)\]\((\S+?)(?:\s+["']([^"']+)["'])?\)/g, (_, alt, src, title) => {
    const safeSrc = resolveSafeUrl(src, basePath, { allowMailto: false });
    if (!safeSrc) return `[Image: ${alt || src}]`;
    const titleAttr = title ? ` title="${escapeText(title)}"` : '';
    return stash(`<img class="prose-image" src="${escapeText(safeSrc)}" alt="${escapeText(alt)}"${titleAttr}>`);
  });

  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
    const safeHref = resolveSafeUrl(href.trim(), basePath, { allowMailto: true });
    if (!safeHref) return `${label} (${href})`;
    return stash(`<a href="${escapeText(safeHref)}" rel="noopener noreferrer">${escapeText(label)}</a>`);
  });

  text = text.replace(/\[\^([^\]]+)\]/g, (_, id) => {
    if (!(id in footnotes)) return `[^${id}]`;
    const safeId = slugifyId(id);
    return stash(`<sup class="footnote-ref"><a href="#note-${safeId}" id="ref-${safeId}" aria-label="Footnote ${escapeText(id)}">${escapeText(id)}</a></sup>`);
  });

  text = escapeText(text);

  // Feather's preferred emphasis is _typewriter-style underlining_ -> italics.
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/_([^_]+)_/g, '<em>$1</em>');
  // Familiar Markdown single-star emphasis is tolerated as a convenience.
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  text = text.replace(/@@FTTOKEN(\d+)@@/g, (_, index) => tokens[Number(index)] ?? '');
  return text;
}

export function referencedFootnotes(blocks) {
  const ids = new Set();

  const inspect = (value) => {
    const text = String(value ?? '');
    for (const match of text.matchAll(/\[\^([^\]]+)\]/g)) ids.add(match[1]);
  };

  for (const block of blocks) {
    if (block.text) inspect(block.text);
    if (block.lines) block.lines.forEach(inspect);
    if (block.items) block.items.forEach(inspect);
    if (block.headers) block.headers.forEach(inspect);
    if (block.rows) block.rows.flat().forEach(inspect);
    if (block.label) inspect(block.label);
    if (block.title) inspect(block.title);
    if (block.attribution) inspect(block.attribution);
  }

  return [...ids];
}

function parseBlocks(tokens) {
  const blocks = [];
  const usedSectionIds = new Set();
  let cursor = 0;
  let bodyStarted = false;

  while (cursor < tokens.length) {
    const token = tokens[cursor];

    if (token.type === 'section') {
      const heading = token.heading;
      const id = uniqueId(`section-${slugifyId(heading.qualifier || heading.title || 'section') || 'section'}`, usedSectionIds);
      blocks.push({
        type: 'sectionHeading',
        id,
        label: heading.label,
        title: heading.title,
      });
      bodyStarted = true;
      cursor += 1;
      continue;
    }

    const line = token.text;
    if (!line.trim()) {
      cursor += 1;
      continue;
    }

    if (line.trim() === '#') {
      blocks.push({ type: 'sceneBreak' });
      bodyStarted = true;
      cursor += 1;
      continue;
    }

    const fence = line.match(FENCE_RE);
    if (fence) {
      const codeLines = [];
      const language = fence[1] || '';
      cursor += 1;
      while (cursor < tokens.length) {
        const current = tokens[cursor];
        if (current.type === 'line' && FENCE_RE.test(current.text)) {
          cursor += 1;
          break;
        }
        if (current.type === 'section') {
          codeLines.push(`${current.heading.label}${current.heading.title ? `\n${current.heading.title}` : ''}`);
        } else {
          codeLines.push(current.text);
        }
        cursor += 1;
      }
      blocks.push({ type: 'code', language, text: codeLines.join('\n') });
      bodyStarted = true;
      continue;
    }

    if (isIndented(line)) {
      const indented = [];

      while (cursor < tokens.length) {
        const current = tokens[cursor];
        if (current.type !== 'line') break;

        if (isIndented(current.text)) {
          indented.push(stripIndent(current.text));
          cursor += 1;
          continue;
        }

        if (!current.text.trim() && nextNonblankTokenIsIndented(tokens, cursor + 1)) {
          indented.push('');
          cursor += 1;
          continue;
        }

        break;
      }

      let attribution = '';
      let lastIndex = indented.length - 1;
      while (lastIndex >= 0 && !indented[lastIndex].trim()) lastIndex -= 1;
      const last = lastIndex >= 0 ? indented[lastIndex].trim() : '';
      const attributionMatch = last.match(ATTRIBUTION_RE);
      if (attributionMatch) {
        attribution = attributionMatch[1].trim();
        indented.splice(lastIndex, 1);
      }

      blocks.push({
        type: bodyStarted ? 'extract' : 'epigraph',
        lines: trimBlankEdges(indented),
        attribution,
      });
      continue;
    }

    const imageMatch = line.trim().match(STANDALONE_IMAGE_RE);
    if (imageMatch) {
      blocks.push({
        type: 'image',
        markdown: line.trim(),
        alt: imageMatch[1],
        source: imageMatch[2],
        title: imageMatch[3] || '',
      });
      bodyStarted = true;
      cursor += 1;
      continue;
    }

    const list = parseListAt(tokens, cursor);
    if (list) {
      blocks.push(list.block);
      bodyStarted = true;
      cursor = list.nextCursor;
      continue;
    }

    const table = parseTableAt(tokens, cursor);
    if (table) {
      blocks.push(table.block);
      bodyStarted = true;
      cursor = table.nextCursor;
      continue;
    }

    const paragraphLines = [];
    while (cursor < tokens.length) {
      const current = tokens[cursor];
      if (current.type === 'section') break;
      if (current.type !== 'line') break;
      if (!current.text.trim()) break;
      if (current.text.trim() === '#') break;
      if (isIndented(current.text)) break;
      if (FENCE_RE.test(current.text)) break;
      if (STANDALONE_IMAGE_RE.test(current.text.trim())) break;
      if (listMatch(current.text)) break;
      if (parseTableAt(tokens, cursor)) break;

      paragraphLines.push(current.text.trim());
      cursor += 1;
    }

    if (paragraphLines.length) {
      blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') });
      bodyStarted = true;
    } else {
      // Defensive escape hatch for a construct we do not recognize yet.
      blocks.push({ type: 'paragraph', text: line.trim() });
      bodyStarted = true;
      cursor += 1;
    }
  }

  return blocks;
}

function parseListAt(tokens, start) {
  const first = tokens[start];
  if (!first || first.type !== 'line') return null;
  const firstMatch = listMatch(first.text);
  if (!firstMatch) return null;

  const ordered = firstMatch.ordered;
  const items = [];
  let cursor = start;

  while (cursor < tokens.length) {
    const token = tokens[cursor];
    if (token.type !== 'line') break;
    const match = listMatch(token.text);
    if (!match || match.ordered !== ordered) break;
    items.push(match.text);
    cursor += 1;
  }

  return {
    block: { type: 'list', ordered, items },
    nextCursor: cursor,
  };
}

function listMatch(line) {
  const unordered = String(line).match(UNORDERED_LIST_RE);
  if (unordered) return { ordered: false, text: unordered[1].trim() };
  const ordered = String(line).match(ORDERED_LIST_RE);
  if (ordered) return { ordered: true, text: ordered[1].trim() };
  return null;
}

function parseTableAt(tokens, start) {
  const headerToken = tokens[start];
  const separatorToken = tokens[start + 1];
  if (!headerToken || !separatorToken) return null;
  if (headerToken.type !== 'line' || separatorToken.type !== 'line') return null;
  if (!headerToken.text.includes('|')) return null;

  const headers = splitTableRow(headerToken.text);
  const separatorCells = splitTableRow(separatorToken.text);
  if (!headers.length || separatorCells.length !== headers.length) return null;
  if (!separatorCells.every((cell) => /^:?-{3,}:?$/.test(cell.replace(/\s+/g, '')))) return null;

  const alignments = separatorCells.map((cell) => {
    const compact = cell.replace(/\s+/g, '');
    if (compact.startsWith(':') && compact.endsWith(':')) return 'center';
    if (compact.endsWith(':')) return 'right';
    if (compact.startsWith(':')) return 'left';
    return '';
  });

  const rows = [];
  let cursor = start + 2;
  while (cursor < tokens.length) {
    const token = tokens[cursor];
    if (token.type !== 'line' || !token.text.trim() || !token.text.includes('|')) break;
    const cells = splitTableRow(token.text);
    if (!cells.length) break;
    while (cells.length < headers.length) cells.push('');
    rows.push(cells.slice(0, headers.length));
    cursor += 1;
  }

  return {
    block: { type: 'table', headers, alignments, rows },
    nextCursor: cursor,
  };
}

function splitTableRow(line) {
  let text = String(line).trim();
  if (text.startsWith('|')) text = text.slice(1);
  if (text.endsWith('|')) text = text.slice(0, -1);
  return text.split('|').map((cell) => cell.trim());
}

function extractFootnotes(lines) {
  const footnotes = {};
  const contentLines = [];
  let inFence = false;

  for (const line of lines) {
    if (FENCE_RE.test(line)) {
      inFence = !inFence;
      contentLines.push(line);
      continue;
    }

    if (!inFence) {
      const match = line.match(FOOTNOTE_DEF_RE);
      if (match) {
        footnotes[match[1]] = match[2].trim();
        continue;
      }
    }

    contentLines.push(line);
  }

  return { lines: contentLines, footnotes };
}

function readStructuralHeading(lines, index) {
  const base = parseStructuralLine(lines[index]);
  if (!base) return null;

  let consumed = 1;
  let title = '';
  const next = lines[index + 1];

  if (
    typeof next === 'string'
    && next.trim()
    && !isIndented(next)
    && !parseStructuralLine(next)
    && next.trim() !== '#'
    && !FENCE_RE.test(next)
    && !listMatch(next)
    && !STANDALONE_IMAGE_RE.test(next.trim())
  ) {
    title = next.trim();
    consumed = 2;
  }

  return {
    ...base,
    title,
    consumed,
  };
}

function parseStructuralLine(line) {
  if (typeof line !== 'string' || isIndented(line)) return null;
  const match = line.trim().match(STRUCTURAL_RE);
  if (!match) return null;

  const keyword = match[1].toLowerCase();
  const qualifier = (match[2] || '').trim();
  return {
    kind: keyword,
    qualifier,
    label: formatStructuralLabel(keyword, qualifier),
  };
}

function formatStructuralLabel(kind, qualifier) {
  const word = kind.charAt(0).toUpperCase() + kind.slice(1);
  return qualifier ? `${word} ${qualifier}` : word;
}

function unitBaseId(heading) {
  const meaningful = heading.qualifier || heading.title || heading.kind;
  return slugifyId(`${heading.kind}-${meaningful}`) || heading.kind;
}

function looksLikeLeadingDocumentTitle(lines, index) {
  const line = lines[index];
  if (!line?.trim() || isIndented(line)) return false;
  if (line.length > 140) return false;
  if (lines[index + 1]?.trim()) return false;

  let cursor = index + 2;
  while (cursor < lines.length && !lines[cursor].trim()) cursor += 1;
  if (cursor >= lines.length) return false;

  const structural = parseStructuralLine(lines[cursor]);
  return Boolean(structural && READING_KINDS.has(structural.kind));
}

function nextNonblankTokenIsIndented(tokens, start) {
  let cursor = start;
  while (cursor < tokens.length) {
    const token = tokens[cursor];
    if (token.type !== 'line') return false;
    if (!token.text.trim()) {
      cursor += 1;
      continue;
    }
    return isIndented(token.text);
  }
  return false;
}

function isIndented(line) {
  return String(line).startsWith('    ') || String(line).startsWith('\t');
}

function stripIndent(line) {
  const text = String(line);
  if (text.startsWith('\t')) return text.slice(1);
  return text.startsWith('    ') ? text.slice(4) : text;
}

function trimBlankEdges(lines) {
  const copy = [...lines];
  while (copy.length && !copy[0].trim()) copy.shift();
  while (copy.length && !copy.at(-1).trim()) copy.pop();
  return copy;
}

function resolveSafeUrl(rawUrl, basePath, { allowMailto }) {
  const url = String(rawUrl ?? '').trim().replaceAll('&amp;', '&');
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (allowMailto && /^mailto:/i.test(url)) return url;
  if (url.startsWith('#')) return url;
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return '';
  if (url.startsWith('//')) return '';
  if (url.startsWith('/')) return url;
  return `${basePath}${url}`;
}

function uniqueId(base, used) {
  const seed = base || 'item';
  let candidate = seed;
  let suffix = 2;
  while (used.has(candidate)) {
    candidate = `${seed}-${suffix}`;
    suffix += 1;
  }
  used.add(candidate);
  return candidate;
}

function escapeText(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function slugifyId(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
