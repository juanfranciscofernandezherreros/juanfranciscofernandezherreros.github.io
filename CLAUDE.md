# Reglas de este repositorio: juanfranciscofernandezherreros.github.io

Sitio Jekyll (build vía GitHub Actions, `.github/workflows/pages.yml`,
desplegado con `actions/deploy-pages`). Cada artículo es un post en
`_posts/`, no un HTML suelto — el front matter controla la URL final.

## Cada artículo lleva slug, nunca `part-N/` a secas

La URL pública de cada artículo (campo `permalink` en el front matter)
sigue siempre este patrón:

```
/argo-real-world-microservices/part-N/<slug-descriptivo>/
/argo-real-world-microservices/part-N/<slug-descriptivo>/es/
```

**Nunca** `/argo-real-world-microservices/part-N/` a secas — `part-N` por
sí solo no es un slug válido.

- `part-N` da el orden de lectura dentro de la serie (se mantiene en la
  URL a petición explícita del usuario — no quitarlo).
- `<slug-descriptivo>` nombra el tema real del artículo — normalmente el
  repo del que trata (`hello-world-argocd`, `gitops-config`,
  `crud-automation`...) o, si no hay un repo concreto, una frase corta en
  kebab-case (`before-you-begin`).
- El slug es el mismo en inglés y en español — solo cambia con el sufijo
  `/es/`, igual que el resto del sitio.

Ejemplos ya en uso (parte → fichero en `_posts/` → permalink):

| Parte | Fichero (en) | Fichero (es) | Permalink |
| --- | --- | --- | --- |
| 0 | `2026-08-23-part-0-before-you-begin.html` | `...-es.html` | `part-0/before-you-begin/` |
| 1 | `2026-08-22-part-1-hello-world-argocd.html` | `...-es.html` | `part-1/hello-world-argocd/` |
| 2 | `2026-08-23-part-2-gitops-config.html` | `...-es.html` | `part-2/gitops-config/` |
| 3 | `2026-08-23-part-3-crud-automation.html` | `...-es.html` | `part-3/crud-automation/` |

## Cómo está montado un post

Cada fichero en `_posts/` es HTML puro (no Markdown — el contenido ya es
HTML estructurado con `<pre>`, diagramas, etc., y kramdown lo estropearía).
Front matter obligatorio en cada post:

```yaml
layout: article
title: "..."                # sin el sufijo " — Argo Real World Microservices"
description: "..."          # meta description / og:description base
og_title: "..."             # opcional, si difiere de title + series
og_description: "..."       # opcional
twitter_title: "..."        # opcional
twitter_description: "..."  # opcional, si es más corto que description
permalink: "/argo-real-world-microservices/part-N/<slug>/[es/]"
lang: "en"                  # o "es"
lang_url: "..."             # URL absoluta de la versión en el otro idioma
series: "Argo Real World Microservices"
part: N
categories: ["Nombre de categoría"]   # una sola, se usa como badge + filtro
tags: ["tag1", "tag2", ...]           # filtro múltiple en la portada
date: "YYYY-MM-DD"
```

El cuerpo del fichero es: un `<style>` completo (cada artículo trae el
suyo, con sus propios tokens — no hay hoja de estilos global compartida
más allá de `assets/css/base.css`, que solo aporta las badges de
categoría/tag) seguido del `<div class="sheet">…</div>` con el contenido
real (titleblock, secciones, footer). El layout `_layouts/article.html`
añade automáticamente la barra de categoría/tags encima; **no** hay que
repetirla a mano dentro del post.

- `_layouts/default.html`: `<head>` común (meta tags, fuentes, `base.css`).
- `_layouts/article.html`: envuelve `default` y añade la barra de badges
  de categoría/tags antes de `{{ content }}`.
- La portada (`index.html`, raíz) lista `site.posts` con `lang == "en"`,
  ordenados por `part`, y monta los filtros (serie, categoría, tags,
  buscador) a partir de esos mismos campos — ver `assets/js/filter.js`.
  Un enlace `?category=<slug>` o `?tag=<slug>` a la portada preselecciona
  ese filtro (usado por las badges de cada artículo).

## Al añadir una parte nueva

1. Crear `_posts/<date>-part-N-<slug>[-es].html` con el front matter de
   arriba (permalink, lang_url, categories, tags, part, series, date).
2. Elegir `categories`/`tags` coherentes con lo ya usado (revisar los
   posts existentes antes de inventar una categoría nueva).
3. Actualizar `lang_url` cruzado entre la versión en/es.
4. Si el artículo anterior tiene un enlace "next" o el siguiente tiene
   "back", actualizarlos a mano dentro del contenido (son HTML estático,
   no se generan solos).
5. Sin `bundle`/`jekyll` instalados localmente en esta máquina — la
   única build real ocurre en GitHub Actions al hacer push a `main`.
   Revisar el log del workflow tras publicar.

Verificar los enlaces con resolución real de URL (no a ojo) antes de
publicar — este repo ya tiene un historial de enlaces rotos por cambiar
la profundidad de anidamiento sin recalcular las rutas relativas. Como
los permalinks se mantienen exactamente iguales a los de antes de migrar
a Jekyll, los enlaces relativos dentro del contenido de cada post (p.ej.
`../../part-1/hello-world-argocd/`) siguen siendo válidos tal cual.
