# juanfranciscofernandezherreros.github.io

![version](https://img.shields.io/badge/version-unversioned-blue)
Personal GitHub Pages site — a Jekyll blog built and deployed via GitHub
Actions (`.github/workflows/pages.yml`). See `AGENTS.md` for the Codex
authoring conventions (post front matter, permalink rules, categories/subcategories/tags).
`CLAUDE.md` is kept for Claude compatibility.

- `index.html` — home page: filterable list of articles (search, category, subcategory, tags).
- `_posts/` — one HTML file per article per language; `permalink` in its
  front matter controls the published URL.
- `_layouts/`, `assets/` — shared layout and styles.

```
bundle install
bundle exec jekyll serve
```
