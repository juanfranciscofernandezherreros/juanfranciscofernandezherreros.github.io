# juanfranciscofernandezherreros.github.io

Personal GitHub Pages site — a Jekyll blog built and deployed via GitHub
Actions (`.github/workflows/pages.yml`). See `AGENTS.md` for the Codex
authoring conventions (post front matter, permalink rules, categories/subcategories/tags).
`CLAUDE.md` is kept for Claude compatibility.

- `index.html` — home page: filterable list of articles (search, category, subcategory, tags).
- `_posts/` — one HTML file per article per language; `permalink` in its
  front matter controls the published URL.
- `_layouts/`, `assets/` — shared layout and styles.

## ArgoCD and GitOps articles

Independent technical articles about ArgoCD, GitOps, Kubernetes, PostgreSQL, failure testing, local access, automation, and Kafka.

Related repos:
- [hello-world-argocd](https://github.com/juanfranciscofernandezherreros/hello-world-argocd) — example microservice deployed with ArgoCD.
- [gitops-config](https://github.com/juanfranciscofernandezherreros/gitops-config) — Kubernetes manifests and ArgoCD `Application` resources.
- [crud-automation](https://github.com/juanfranciscofernandezherreros/crud-automation) — microservice generator used in an automation article.

## Java & Spring Interview Notes

Independent bilingual articles for technical interview preparation. These
posts use categories, subcategories, tags, and stable topic-based URLs.

## Local preview

No local Ruby toolchain is set up in this environment; the only real
build currently happens in GitHub Actions on push to `main`. To preview
locally with Ruby installed:

```
bundle install
bundle exec jekyll serve
```
