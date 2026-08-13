import assert from 'node:assert/strict';
import { inlineHtml, parseFeather, referencedFootnotes } from '../assets/js/parser.js';

const fiction = `THE LONG NIGHT\n\nPART I\nThe City\n\nCHAPTER 1\nThe Call\n\n    A quotation.\n        -- Someone\n\nFirst paragraph with _emphasis_.\n\n#\n\nSecond paragraph.\n\n    Dear Judith,\n\n    Goodbye.\n\nA note.[^1]\n\nSECTION\nAfter Midnight\n\nMore prose.\n\nCHAPTER 2\nThe House\n\nLast paragraph.\n\n[^1]: Footnote text.`;
const parsed = parseFeather(fiction, { fallbackTitle: 'Manuscript' });

assert.equal(parsed.documentTitle, 'THE LONG NIGHT');
assert.equal(parsed.units.length, 3);
assert.equal(parsed.units[0].kind, 'part');
assert.equal(parsed.units[0].label, 'Part I');
assert.equal(parsed.units[0].title, 'The City');
assert.equal(parsed.units[1].kind, 'chapter');
assert.equal(parsed.units[1].label, 'Chapter 1');
assert.equal(parsed.units[1].title, 'The Call');
assert.equal(parsed.units[1].blocks[0].type, 'epigraph');
assert.equal(parsed.units[1].blocks[0].attribution, 'Someone');
assert.ok(parsed.units[1].blocks.some((block) => block.type === 'sceneBreak'));
assert.ok(parsed.units[1].blocks.some((block) => block.type === 'extract'));
assert.equal(parsed.units[1].sections.length, 1);
assert.equal(parsed.units[1].sections[0].title, 'After Midnight');
assert.equal(parsed.footnotes['1'], 'Footnote text.');
assert.deepEqual(referencedFootnotes(parsed.units[1].blocks), ['1']);
assert.equal(parsed.units[2].label, 'Chapter 2');

const nonfiction = parseFeather(`CHAPTER 3\nEvidence\n\nThe archive contains [records](https://example.com).\n\n![Ledger page](images/ledger.jpg)\n\nThe materials were:\n\n- letters\n- maps\n- photographs\n\nThe sequence was:\n\n1. Collect.\n2. Compare.\n3. Verify.\n\n| Year | Count |\n| --- | ---: |\n| 1900 | 12 |\n| 1910 | 18 |\n\n\`\`\`js\nconsole.log("hello");\n\`\`\``);
const blocks = nonfiction.units[0].blocks;
assert.ok(blocks.some((block) => block.type === 'image'));
assert.ok(blocks.some((block) => block.type === 'list' && block.ordered === false));
assert.ok(blocks.some((block) => block.type === 'list' && block.ordered === true));
assert.ok(blocks.some((block) => block.type === 'table'));
assert.ok(blocks.some((block) => block.type === 'code'));

const html = inlineHtml('Use _italics_, **bold**, `code`, [site](https://example.com), and ![alt](images/a.jpg).', {}, { basePath: 'books/demo/' });
assert.match(html, /<em>italics<\/em>/);
assert.match(html, /<strong>bold<\/strong>/);
assert.match(html, /<code>code<\/code>/);
assert.match(html, /href="https:\/\/example\.com"/);
assert.match(html, /src="books\/demo\/images\/a\.jpg"/);
assert.doesNotMatch(inlineHtml('[bad](javascript:alert(1))'), /href=/);

const empty = parseFeather('', { fallbackTitle: 'Blank Draft' });
assert.equal(empty.units.length, 1);
assert.equal(empty.units[0].kind, 'document');
assert.equal(empty.units[0].title, 'Blank Draft');

const sectionsOnly = parseFeather(`SECTION\nFirst Topic\n\nText.`, { fallbackTitle: 'Essay' });
assert.equal(sectionsOnly.units.length, 1);
assert.equal(sectionsOnly.units[0].title, 'Essay');
assert.equal(sectionsOnly.units[0].sections[0].title, 'First Topic');

console.log('Feather parser tests passed.');
