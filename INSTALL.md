# Install Feather at /library on an existing GitHub Pages site

Merge these two entries into the root of your personal-site repository:

- `library/` → your site's `library/` directory
- `.github/workflows/pages.yml` → the repository-level Pages workflow

Do not replace your site's root `index.html`, `CNAME`, `img/`, or other existing content.

Then, in the GitHub repository, change:

**Settings → Pages → Build and deployment → Source → GitHub Actions**

After that, every push to `main` builds Feather's manifest and deploys the complete personal site. The library is available at `/library/`.
