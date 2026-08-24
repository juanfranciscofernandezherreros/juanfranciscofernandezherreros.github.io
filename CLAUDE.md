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

- `_layouts/default.html`: `<head>` común (meta tags, viewport, la hoja de
  Google Fonts, `base.css`). **No** repetir el meta viewport ni el
  `<link>` de fonts.googleapis.com dentro del contenido de ningún post o
  página raíz (`index.html`, `commands.html`, `introduction*.html`) —
  `default.html` ya los pone en `<head>` para todo el sitio; duplicarlos
  en `{{ content }}` los mete además en el `<body>` (posición inválida) y
  duplica la petición de red, lo cual penaliza LCP/render-blocking en
  Lighthouse/PageSpeed. Ya pasó en `index.html` y `commands.html` — se
  corrigió quitando la copia repetida.
- `_layouts/article.html`: envuelve `default` y añade la barra de badges
  de categoría/tags antes de `{{ content }}`.
- La portada (`index.html`, raíz) lista `site.posts` con `lang == "en"`,
  ordenados por `part`, y monta los filtros (serie, categoría, tags,
  buscador) a partir de esos mismos campos — ver `assets/js/filter.js`.
  Un enlace `?category=<slug>` o `?tag=<slug>` a la portada preselecciona
  ese filtro (usado por las badges de cada artículo).

## Alineación de texto — igual en todos los artículos

Todo el texto de cuerpo de cualquier artículo (párrafos, `<li>`,
definiciones de `.term-card`, `.note`, celdas de `.compare-col`, etc.)
va **alineado a la izquierda** — nunca centrado ni justificado. Es el
comportamiento por defecto de `p`, `li`, `dd` en el CSS de cada artículo
(no llevan `text-align`); no añadir `text-align:center` ni
`text-align:justify` a bloques de texto nuevos.

Esto aplica a **todo** el contenido de cada artículo (`_posts/*.html`,
`introduction*.html`) y a `commands.html`, incluidas las etiquetas de
conexión de los diagramas `.arch` (`.arch-arrow-row`) — también van
alineadas a la izquierda (`justify-content:flex-start; text-align:left;`),
no centradas, aunque conecten dos cajas a ancho completo. La única
excepción sigue siendo `index.html` (la portada), donde el `h1`/`.role`
del encabezado sí está centrado a propósito — no extender ese centrado a
texto de artículo ni a diagramas.

Mantener también el mismo ancho de columna de lectura en todos los
artículos: `p{ max-width:70ch; line-height:1.6; }` y `.sheet{ max-width:920px; }`,
copiados tal cual del resto de posts. Si un artículo nuevo cambia estos
valores, el texto deja de alinearse visualmente con el resto de la serie
al navegar de uno a otro.

## Al añadir una parte nueva

1. Crear `_posts/<date>-part-N-<slug>[-es].html` con el front matter de
   arriba (permalink, lang_url, categories, tags, part, series, date).
2. Elegir `categories`/`tags` coherentes con lo ya usado (revisar los
   posts existentes antes de inventar una categoría nueva).
3. Actualizar `lang_url` cruzado entre la versión en/es.
4. Si el artículo anterior tiene un enlace "next" o el siguiente tiene
   "back", actualizarlos a mano dentro del contenido (son HTML estático,
   no se generan solos).
5. Añadir cualquier comando de terminal nuevo del artículo a
   `commands.html` (`/commands/`) — ver más abajo. Es el glosario
   centralizado, no se genera solo a partir de los posts.
6. Sin `bundle`/`jekyll` instalados localmente en esta máquina — la
   única build real ocurre en GitHub Actions al hacer push a `main`.
   Revisar el log del workflow tras publicar.

## `introduction.html` / `introduction-es.html` — teoría, fuera de la numeración

Páginas estáticas en la raíz (`/argo-real-world-microservices/introduction/`
y `.../es/`), con `layout: "article"` pero sin campo `part` — no viven en
`_posts/` ni aparecen en el slider/listado de `site.posts` de la portada
(ese bucle asume `part` numérico). Son el equivalente teórico de la serie:
qué es un microservicio, un contenedor, Kubernetes, CI/CD, GitOps y ArgoCD,
sin comandos ni pasos prácticos. Enlazadas desde `index.html`
(`.top-links`, junto a `/commands/`) y desde la Parte 0 (nota al inicio de
la sección `#what`, en ambos idiomas). Al editarlas, mantener el
`lang_url` cruzado y los enlaces relativos según su profundidad real
(`/argo-real-world-microservices/introduction/` = 2 niveles bajo la raíz;
`.../es/` = 3).

## `commands.html` — glosario de comandos

Página estática en la raíz (`/commands/`), enlazada desde la portada.
Centraliza **todos** los comandos de terminal usados en la serie,
agrupados por herramienta (`winget`, `git`, `docker`, `kind`, `kubectl`,
`argocd`, `maven / java`, `python`, `curl` — cada uno con su propio
`<section class="tool-section" id="...">`) en vez de por artículo, para
que sea un glosario de consulta y no un resumen narrativo.

No se genera con Liquid a partir de los posts — es contenido curado a
mano, cada `.cmd-entry` con: el comando exacto tal como aparece en el
artículo (dentro de un `<pre>`, con el binario envuelto en
`<span class="c">` igual que en los artículos), una descripción corta, y
uno o más enlaces `.refs` de vuelta al artículo de origen (con ancla
`#install`, `#verify`, `#startup`, `#commands`... cuando la sección
tiene `id`; sin ancla si el comando vive antes de la primera `<section>`
del artículo, p.ej. dentro del panel "Live locally").

Al añadir un artículo nuevo con comandos:
- Si el comando ya existe (mismo binario + mismo propósito, p.ej.
  `docker build` o `mvn -f app/pom.xml clean package` que se repiten en
  varias partes), añadir el nuevo enlace `.refs` a la entrada existente
  en vez de duplicar la entrada.
- Si es un comando nuevo, añadir una `.cmd-entry` nueva bajo la
  `tool-section` de su binario (crear la sección + entrada en el `.toc`
  de arriba si es una herramienta nueva en la serie).
- Actualizar el `<span class="count">` de la sección — debe coincidir
  con el número real de `.cmd-entry` dentro de ella.
- El buscador de la página (`assets/js/commands-filter.js`) funciona
  sobre el texto visible de cada `.cmd-entry` — no hace falta tocarlo al
  añadir entradas nuevas.

Verificar los enlaces con resolución real de URL (no a ojo) antes de
publicar — este repo ya tiene un historial de enlaces rotos por cambiar
la profundidad de anidamiento sin recalcular las rutas relativas. Como
los permalinks se mantienen exactamente iguales a los de antes de migrar
a Jekyll, los enlaces relativos dentro del contenido de cada post (p.ej.
`../../part-1/hello-world-argocd/`) siguen siendo válidos tal cual.
