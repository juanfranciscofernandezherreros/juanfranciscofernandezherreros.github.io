# Reglas de este repositorio para Codex: juanfranciscofernandezherreros.github.io

Estas instrucciones aplican a todo el repositorio. Codex debe leerlas antes de modificar archivos y respetarlas en cualquier cambio dentro del árbol del proyecto.

Sitio Jekyll (build vía GitHub Actions, `.github/workflows/pages.yml`, desplegado con `actions/deploy-pages`). Cada artículo del curso es un post en `_posts/`; el front matter controla la URL final.

## Flujo de trabajo para Codex

- Antes de editar, revisar los archivos relacionados y reutilizar las convenciones existentes; no inventar estructuras, categorías, estilos o rutas si ya existe un patrón en el repositorio.
- Mantener los cambios mínimos y centrados en la petición del usuario.
- No cambiar permalinks existentes salvo petición explícita: pueden romper enlaces externos, navegación y progreso guardado en `localStorage`.
- Tras cambios que afecten al sitio, validar HTML/Liquid/rutas en la medida de lo posible. Si no hay Ruby/Jekyll local, no fingir una build: indicar que la validación definitiva ocurre en GitHub Actions.
- Si se añaden o cambian comandos usados en artículos del curso, sincronizar `commands.html` según las reglas de este documento.
- Verificar enlaces calculando la URL real, no únicamente por inspección visual.
- No duplicar metadatos, fuentes o estilos globales que ya aporta `_layouts/default.html`.

## Cada artículo del curso lleva slug, nunca `part-N/` a secas

La URL pública de cada artículo (campo `permalink` en el front matter) sigue siempre este patrón:

```text
/argo-real-world-microservices/part-N/<slug-descriptivo>/
/argo-real-world-microservices/part-N/<slug-descriptivo>/es/
```

**Nunca** `/argo-real-world-microservices/part-N/` a secas: `part-N` por sí solo no es un slug válido.

- `part-N` da el orden de lectura dentro de la serie y se mantiene en la URL; no quitarlo.
- `<slug-descriptivo>` nombra el tema real del artículo, normalmente el repo del que trata (`hello-world-argocd`, `gitops-config`, `crud-automation`...) o una frase corta en kebab-case (`before-you-begin`).
- El slug es el mismo en inglés y español; solo cambia el sufijo `/es/`.

Ejemplos ya en uso:

| Parte | Fichero (en) | Fichero (es) | Permalink |
| --- | --- | --- | --- |
| 0 | `2026-08-23-part-0-before-you-begin.html` | `...-es.html` | `part-0/before-you-begin/` |
| 1 | `2026-08-22-part-1-hello-world-argocd.html` | `...-es.html` | `part-1/hello-world-argocd/` |
| 2 | `2026-08-23-part-2-gitops-config.html` | `...-es.html` | `part-2/gitops-config/` |
| 3 | `2026-08-23-part-3-crud-automation.html` | `...-es.html` | `part-3/crud-automation/` |

### Artículos independientes del curso

Los posts que no pertenecen a `Argo Real World Microservices` no llevan `part` y usan una URL temática: `/<tema>/<slug>/` en inglés y `/<tema>/<slug>/es/` en español. Deben conservar `series` para que la portada pueda agruparlos y filtrarlos. La portada coloca primero el recorrido del curso y después los artículos independientes, ordenados por fecha.

## Cómo está montado un post

Cada fichero en `_posts/` es HTML puro, no Markdown. El contenido ya usa HTML estructurado con `<pre>`, diagramas, etc., y kramdown puede estropearlo.

Front matter obligatorio en cada post:

```yaml
layout: article
title: "..."
description: "..."
og_title: "..."             # opcional
og_description: "..."       # opcional
twitter_title: "..."        # opcional
twitter_description: "..."  # opcional
permalink: "/argo-real-world-microservices/part-N/<slug>/[es/]"
lang: "en"                  # o "es"
lang_url: "..."             # URL absoluta de la versión en el otro idioma
series: "Argo Real World Microservices"
part: N
categories: ["Nombre de categoría"]
subcategories: ["Nombre de subcategoría"]
tags: ["tag1", "tag2"]
date: "YYYY-MM-DD"
reading_minutes: N
```

`reading_minutes` se calcula con el texto real del cuerpo, excluyendo `<style>` y etiquetas, aproximadamente a 200 palabras/minuto, redondeando hacia arriba y con mínimo 3.

El cuerpo del fichero lleva un `<style>` propio seguido del `<div class="sheet">…</div>` con el contenido real. `_layouts/article.html` añade automáticamente la barra de categorías, subcategorías y tags; no repetirla dentro del post.

- `_layouts/default.html` contiene el `<head>` común, viewport, Google Fonts y `assets/css/base.css`. No repetir meta viewport ni `<link>` de fonts.googleapis.com dentro de posts o páginas raíz.
- `_layouts/article.html` envuelve `default` y añade la barra de badges antes de `{{ content }}`.
- `index.html` lista `site.posts` y construye filtros de serie, categoría, subcategoría, tags y búsqueda mediante `assets/js/filter.js`.
- Los enlaces `?category=<slug>`, `?subcategory=<slug>` y `?tag=<slug>` preseleccionan filtros en portada.

## Alineación de texto

El texto de prosa debe ir justificado, con partición automática de palabras:

```css
text-align: justify;
hyphens: auto;
-webkit-hyphens: auto;
```

Esto aplica a párrafos `p`, definiciones `.term-card dd`, `.note p`, `<li>` de `.compare-col` y bloques equivalentes de prosa. Nunca centrar texto de artículo.

Las etiquetas cortas de una línea (eyebrows, badges, captions de diagramas como `.arch-arrow-row`) van alineadas a la izquierda.

La excepción es `index.html`, donde el `h1`/`.role` del encabezado sí está centrado intencionadamente.

Mantener el mismo ancho de lectura en los artículos:

```css
p { max-width: 70ch; line-height: 1.6; }
.sheet { max-width: 920px; }
```

## Al añadir una parte nueva

1. Crear `_posts/<date>-part-N-<slug>[-es].html` con `permalink`, `lang_url`, `categories`, `subcategories`, `tags`, `part`, `series`, `date` y `reading_minutes`.
2. Reutilizar categorías/subcategorías/tags coherentes con los posts existentes antes de inventar otros nuevos.
3. Actualizar `lang_url` cruzado entre EN y ES.
4. Actualizar manualmente enlaces `next`/`back` cuando existan.
5. Añadir los comandos nuevos del artículo a `commands.html` (`/commands/`).
6. Si no hay `bundle`/`jekyll` instalados localmente, la build real se valida en GitHub Actions; revisar el workflow después de publicar.

## `introduction.html` / `introduction-es.html`

Son páginas teóricas estáticas en `/argo-real-world-microservices/introduction/` y `/argo-real-world-microservices/introduction/es/`, con `layout: article` pero sin `part`. No viven en `_posts/` ni forman parte del listado que asume `part` numérico.

Al editarlas, mantener `lang_url` cruzado y resolver correctamente los enlaces según la profundidad de cada URL.

## `argo-real-world-microservices.html` / `-es.html`

Son la landing y temario del curso. No tienen `part`. El progreso usa `assets/js/course-progress.js` y la clave `argo-course-progress`, indexada por `post.url`; por eso no se deben cambiar permalinks sin necesidad.

El temario se genera con Liquid a partir de `site.posts` filtrados por idioma y ordenados por `part`, además de la Introduction correspondiente. No duplicar manualmente título, descripción ni minutos de lectura: usar `post.title`, `post.description` y `post.reading_minutes`.

El progreso es independiente entre EN y ES de forma intencionada.

## `commands.html` — glosario de comandos

`commands.html` centraliza todos los comandos de terminal del curso, agrupados por herramienta (`winget`, `git`, `docker`, `kind`, `kubectl`, `argocd`, `maven / java`, `python`, `curl`, etc.).

Cada `.cmd-entry` contiene:

- el comando exacto dentro de `<pre>`;
- una descripción corta;
- uno o más enlaces `.refs` al artículo de origen, con ancla cuando la sección tenga `id`.

Al añadir un artículo con comandos:

- Si el comando ya existe con el mismo propósito, añadir la nueva referencia a la entrada existente en lugar de duplicarla.
- Si es nuevo, añadir una `.cmd-entry` en la `tool-section` correspondiente; crear también la sección y su entrada en `.toc` si aparece una herramienta nueva.
- Actualizar el `<span class="count">` de la sección para que coincida con el número real de `.cmd-entry`.
- No tocar `assets/js/commands-filter.js` salvo que cambie el comportamiento del buscador.

## Enlaces y compatibilidad

Verificar siempre los enlaces con resolución real de URL. Este repositorio ha tenido enlaces rotos por cambios de profundidad. Los permalinks existentes deben mantenerse salvo petición explícita.

`CLAUDE.md` se conserva por compatibilidad con Claude; para Codex, la fuente de instrucciones del repositorio es este `AGENTS.md`.