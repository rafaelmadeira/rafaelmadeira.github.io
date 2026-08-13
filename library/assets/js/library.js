import { bookUrl, escapeHtml, loadManifest, renderBookCover, renderError } from './common.js';

const grid = document.querySelector('#book-grid');

try {
  const manifest = await loadManifest();

  if (!manifest.books.length) {
    grid.innerHTML = '<p class="empty-state">No books yet. Add a folder under <code>books/</code> and push again.</p>';
  } else {
    grid.innerHTML = manifest.books.map((book) => `
      <article class="book-card">
        <a class="cover-link" href="${bookUrl(book.slug)}" aria-label="Open ${escapeHtml(book.title)}">
          ${renderBookCover(book, { loading: 'lazy' })}
        </a>
        <div class="book-card-copy">
          <h2><a href="${bookUrl(book.slug)}">${escapeHtml(book.title)}</a></h2>
          <p class="book-author${book.author ? '' : ' is-placeholder'}">${book.author ? escapeHtml(book.author) : 'Author not set'}</p>
          ${book.status ? `<p class="book-status">${escapeHtml(book.status)}</p>` : ''}
        </div>
      </article>
    `).join('');
  }
} catch (error) {
  renderError(grid, error.message);
}
