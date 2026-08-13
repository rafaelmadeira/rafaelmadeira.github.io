# Feather Writing Library

A dependency-free browser reader for Feather manuscripts. This copy is configured to live inside an existing GitHub Pages site at `/library/`.

Feather is plain text that reads like a manuscript and knows it is a book. See `FEATHER.md` for the language specification.

## Intended site layout

Merge this package into the root of your personal-site repository:

```text
/
├── .github/
│   └── workflows/
│       └── pages.yml
├── CNAME
├── index.html
├── img/
└── library/
    ├── index.html
    ├── book.html
    ├── reader.html
    ├── assets/
    ├── books/
    ├── scripts/
    ├── package.json
    └── FEATHER.md
```

The reader uses relative URLs, so publishing this directory at `/library/` automatically keeps its assets, manifest, books, reader links, and manuscript images under `/library/`. No hard-coded domain or base path is required.

## Add a book

Creating a folder is enough:

```text
library/books/my-new-book/
```

On the next deployment it appears in the library. Everything else is optional and has a graceful fallback.

Typical book folder:

```text
library/books/my-new-book/
├── book.txt
├── cover.jpg
└── manuscript.feather
```

`book.txt` can contain:

```text
title: My New Book
author: Your Name
started: 2026-08-13
status: Draft
description: Optional description.
```

If `book.txt` is absent, the title is derived from the folder name. Missing author, description, cover, and manuscript content are handled by the UI.

A `.feather` file may contain one chapter, several chapters, or an entire book. Structural headings inside the manuscript determine the table of contents.

## GitHub Pages deployment

This integration uses a repository-level workflow:

```text
.github/workflows/pages.yml
```

On every push to `main`, it:

1. builds `library/books/manifest.json` from the current book folders and `.feather` files;
2. uploads the **whole personal-site repository** as the Pages artifact;
3. deploys that artifact to GitHub Pages.

This means the generated manifest does not need to be committed back to the repository, and Feather remains just one `/library/` section of the same site.

After copying the workflow, set the repository's **Settings → Pages → Build and deployment → Source** to **GitHub Actions**.

The workflow does not replace or modify your root `index.html`, `CNAME`, `img/`, or other site files; it simply publishes the repository after generating Feather's manifest in the temporary Actions checkout.

## Local preview

From the `library` directory:

```bash
npm run preview
```

Then open:

```text
http://localhost:8080
```

To test the exact `/library/` URL shape, run a static server from the **repository root** and open:

```text
http://localhost:PORT/library/
```

## Useful commands

From `library/`:

```bash
npm run build
npm test
npm run serve
npm run preview
```

The project has no npm package dependencies; Node is used only for the manifest builder, tests, and local preview server.

## Reading progress

Continue Reading uses browser `localStorage`, independently for each book. No database or backend is required. Progress is local to that browser/device.
