# juanfranciscofernandezherreros.github.io

Personal GitHub Pages site — a Jekyll blog built and deployed via GitHub
Actions (`.github/workflows/pages.yml`). See `CLAUDE.md` for the
authoring conventions (post front matter, permalink rules, categories/tags).

- `index.html` — home page: filterable list of articles (search, series,
  category, tags).
- `_posts/` — one HTML file per article per language; `permalink` in its
  front matter controls the published URL.
- `_layouts/`, `assets/` — shared layout and styles.

## Argo Real World Microservices

A hands-on series on deploying microservices with ArgoCD and GitOps:

- **Part 0 — Before You Begin**: tooling setup (Git, Docker, kind, kubectl, Java, Maven, ArgoCD CLI).
- **Part 1 — Hello World with ArgoCD**: deploying a microservice with ArgoCD over a local `kind` cluster — glossary, architecture, the reconciliation loop, real screenshots end to end.
- **Part 2 — The Config Repo**: the `gitops-config` repo, its manifests and `Application` resource, line by line.
- **Part 3 — Generating a New Microservice**: using `crud-automation` to generate and onboard a second service into the same GitOps pattern.

Related repos:
- [hello-world-argocd](https://github.com/juanfranciscofernandezherreros/hello-world-argocd) — the microservice used in Part 1.
- [gitops-config](https://github.com/juanfranciscofernandezherreros/gitops-config) — its Kubernetes manifests and ArgoCD `Application`.
- [crud-automation](https://github.com/juanfranciscofernandezherreros/crud-automation) — the generator used in Part 3.

## Local preview

No local Ruby toolchain is set up in this environment; the only real
build currently happens in GitHub Actions on push to `main`. To preview
locally with Ruby installed:

```
bundle install
bundle exec jekyll serve
```
