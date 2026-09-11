# Reglas editoriales y técnicas del repositorio

Estas reglas aplican a todo `juanfranciscofernandezherreros.github.io` y son la fuente de verdad para cualquier agente que modifique el blog. `AGENTS.md` y `CLAUDE.md` deben permanecer sincronizados y contener las mismas normas.

El sitio es Jekyll, se construye con `.github/workflows/pages.yml` y se despliega mediante GitHub Pages. Antes de editar, revisar siempre los archivos relacionados, reutilizar patrones existentes y hacer cambios mínimos, coherentes y verificables.

## Objetivo editorial

El blog debe parecer una publicación técnica cuidada, no una colección de páginas independientes. Cada artículo debe ser correcto, útil, legible, visualmente coherente y suficientemente completo para que un lector técnico entienda el tema sin depender de contexto implícito.

- Priorizar claridad, precisión técnica y ejemplos concretos sobre relleno.
- Explicar el porqué además del cómo.
- Evitar repeticiones, frases vacías, introducciones largas y conclusiones que solo repiten el texto.
- No inventar resultados, comandos ejecutados, benchmarks, versiones, capturas o comportamientos no verificados.
- Si un dato puede cambiar con el tiempo, comprobarlo antes de publicarlo.
- Mantener tono profesional, directo y pedagógico.
- Los artículos EN y ES deben cubrir el mismo contenido y estructura esencial; no hacer una versión claramente inferior a la otra.

## Flujo obligatorio antes de modificar contenido

1. Leer este archivo completo.
2. Revisar uno o dos artículos recientes del mismo tipo para copiar convenciones reales de estructura, CSS, badges y navegación.
3. Comprobar si existe versión EN/ES y mantener ambas coordinadas cuando la petición afecte al contenido compartido.
4. Revisar categorías, subcategorías y tags ya usados antes de crear otros.
5. No cambiar permalinks existentes salvo petición explícita.
6. Verificar rutas y enlaces resolviendo la URL final, no solo a ojo.
7. Después de editar, revisar front matter, HTML, Liquid, enlaces, navegación y consistencia visual.
8. Si no hay Jekyll/Ruby disponible localmente, no afirmar que la build pasó: la validación definitiva es GitHub Actions.

## Tipos de contenido

### Artículos del curso Argo Real World Microservices

Viven en `_posts/` y usan:

```text
/argo-real-world-microservices/part-N/<slug-descriptivo>/
/argo-real-world-microservices/part-N/<slug-descriptivo>/es/
```

Nunca usar `/part-N/` a secas. `part-N` conserva el orden del curso y `<slug-descriptivo>` identifica el tema. El slug debe ser igual en EN y ES; solo cambia `/es/`.

Nombre de archivo:

```text
_posts/YYYY-MM-DD-part-N-<slug>.html
_posts/YYYY-MM-DD-part-N-<slug>-es.html
```

### Artículos independientes

También viven en `_posts/`, pero no llevan `part`. Deben usar una URL temática estable:

```text
/<tema>/<slug>/
/<tema>/<slug>/es/
```

Deben incluir `series` para que la portada pueda agruparlos y filtrarlos.

### Páginas estáticas editoriales

`introduction*.html`, `argo-real-world-microservices*.html`, `commands.html` y páginas teóricas similares pueden vivir en la raíz cuando no deben participar como posts de `site.posts`. Deben seguir las mismas reglas visuales, de accesibilidad y calidad que los artículos.

## Front matter

Todo post debe tener como mínimo:

```yaml
layout: article
title: "..."
description: "..."
permalink: "/ruta/estable/"
lang: "en" # o "es"
lang_url: "/ruta/de/la/otra/version/"
series: "..."
categories: ["..."]
subcategories: ["..."]
tags: ["...", "..."]
date: "YYYY-MM-DD"
reading_minutes: N
```

Los artículos del curso añaden:

```yaml
part: N
```

`og_title`, `og_description`, `twitter_title` y `twitter_description` son opcionales y solo deben añadirse si aportan una variante útil. No duplicar metadatos sin motivo.

`lang_url` debe ser una ruta absoluta desde la raíz del sitio, por ejemplo `/java/solid-principles/es/`. `_layouts/default.html` la transforma con `absolute_url` para `hreflang`. No exigir una URL completa con dominio dentro del front matter.

`reading_minutes` se estima con el texto real visible del artículo, excluyendo `<style>`, HTML y bloques puramente decorativos: unas 200 palabras por minuto, redondeando hacia arriba y con mínimo 3.

## Estructura de un artículo

Cada artículo debe incluir:

- un `<style>` propio cuando necesite estilos específicos;
- un único contenedor principal `.sheet`;
- un `titleblock` o encabezado equivalente con contexto claro;
- secciones ordenadas con `id` estable cuando puedan enlazarse;
- ejemplos, diagramas, tablas o código solo cuando aporten comprensión;
- navegación de idioma si existe traducción;
- navegación anterior/siguiente cuando pertenezca a una serie secuencial.

No duplicar manualmente la barra de categorías/subcategorías/tags: `_layouts/article.html` ya la genera.

## Diseño visual común

La identidad del blog debe mantenerse aunque cada artículo pueda tener una paleta ligeramente distinta.

Valores base para contenido editorial:

```css
.sheet { max-width: 920px; margin: 48px auto 96px; padding: 0 24px; }
p { max-width: 70ch; line-height: 1.6; text-align: justify; hyphens: auto; -webkit-hyphens: auto; }
```

- No ampliar `.sheet` ni la medida de lectura sin una razón específica.
- El texto de prosa debe ir justificado; en móvil puede pasar a izquierda si mejora legibilidad.
- No centrar párrafos, listas explicativas ni texto de diagramas.
- Eyebrows, captions, badges y etiquetas cortas van a la izquierda.
- `index.html` puede mantener su encabezado centrado de forma intencionada.
- Mantener jerarquía tipográfica consistente: `h1` principal, `h2` por sección y `h3` para bloques internos.
- Evitar bloques gigantes de texto: dividir por ideas, no por longitud arbitraria.
- Tablas y código deben tener `overflow-x:auto` o equivalente en pantallas pequeñas.
- Los estados hover/focus deben conservar contraste y ser visibles.

## HTML y layout global

`_layouts/default.html` ya aporta `<head>`, viewport, Google Fonts, `base.css`, `theme.css`, canonical y metadatos sociales.

Por tanto:

- no añadir `<html>`, `<head>` o `<body>` dentro de artículos;
- no repetir `<meta name="viewport">`;
- no repetir enlaces a `fonts.googleapis.com`;
- no repetir CSS global salvo que el artículo necesite una excepción concreta;
- preferir HTML semántico: `article`, `section`, `nav`, `table`, `figure`, `figcaption`, `code`, `pre` cuando correspondan.

## Calidad del contenido técnico

Todo artículo técnico debe pasar estas comprobaciones:

- los nombres de herramientas, APIs, clases, métodos y conceptos son correctos;
- los comandos son ejecutables en el contexto descrito;
- las rutas, puertos, namespaces, nombres de recursos y versiones no se contradicen dentro del artículo;
- el código mostrado compila o es explícitamente pseudocódigo;
- las transiciones entre teoría y ejemplo están explicadas;
- una tabla o diagrama no contradice el texto;
- los estados de error, limitaciones o casos inválidos importantes se mencionan;
- no presentar una simplificación didáctica como si fuera una regla universal.

Cuando un artículo acompaña a un repositorio de ejemplo, el texto y el proyecto deben describir el mismo dominio, estados, endpoints, nombres y flujo.

## Código y comandos

Los bloques de terminal deben mostrar el comando exacto. Si el curso introduce un comando nuevo, sincronizar también `commands.html`.

En `commands.html`:

- reutilizar una entrada existente si el comando y propósito son equivalentes;
- añadir la nueva referencia `.refs` en lugar de duplicar;
- si aparece una herramienta nueva, crear su `tool-section` y entrada en el TOC;
- actualizar el `<span class="count">` de la sección;
- los enlaces de referencia deben apuntar al `id` real de la sección de origen.

No modificar `assets/js/commands-filter.js` salvo que cambie el comportamiento del buscador.

## Enlaces y navegación

- No cambiar permalinks existentes salvo petición expresa: pueden romper SEO, enlaces externos, navegación y progreso guardado.
- Preferir rutas Jekyll estables (`relative_url`/`absolute_url`) en plantillas y páginas Liquid.
- En HTML estático de artículos, comprobar la profundidad real de cualquier ruta relativa.
- Los enlaces EN ↔ ES deben ser recíprocos.
- Los enlaces anterior/siguiente de una serie deben formar una cadena correcta.
- Toda ancla `#...` debe existir realmente en el destino.
- Los enlaces a archivos descargables deben apuntar a un archivo existente en el repositorio publicado.

## Bilingüismo

Cuando haya pareja EN/ES:

- mismo slug y estructura conceptual;
- `lang` correcto;
- `lang_url` cruzado y recíproco;
- mismas secciones esenciales, ejemplos, tablas y recursos;
- adaptar el idioma, no traducir nombres de APIs, código, comandos o identificadores técnicos que deban conservarse;
- mantener categorías y tags coherentes. Se permite traducir una etiqueta editorial si el sitio ya sigue ese patrón, pero no crear taxonomías duplicadas sin necesidad.

Si solo existe una versión por decisión editorial, no inventar automáticamente la otra salvo que el usuario lo pida.

## SEO y descubrimiento

Cada artículo debe tener:

- título específico y descriptivo;
- `description` útil, natural y distinta del título;
- un único `h1` visible;
- headings en orden lógico;
- permalink corto, descriptivo y estable;
- categorías/tags relevantes, no una lista de palabras clave indiscriminada;
- canonical gestionado por el layout;
- `hreflang` cuando existe `lang_url`.

No llenar `og_*` o `twitter_*` copiando exactamente el resto del front matter salvo que haya una razón real.

## Accesibilidad

- Toda imagen informativa necesita `alt` que describa lo que aporta; una imagen decorativa puede usar `alt=""`.
- No depender únicamente del color para comunicar estados.
- Mantener contraste suficiente en light y dark mode.
- Enlaces y controles deben tener texto comprensible fuera de contexto.
- Diagramas complejos deben incluir una explicación textual cercana.
- Tablas deben usar `th` para encabezados.
- No usar tamaños de fuente tan pequeños que dificulten la lectura.
- Mantener navegación por teclado y `:focus-visible` cuando haya controles personalizados.

## Imágenes, diagramas y descargas

- Usar assets locales con nombres descriptivos y estables.
- Evitar imágenes enormes si pueden optimizarse sin pérdida útil.
- Capturas de terminal deben complementar, no sustituir, el comando en texto.
- Toda descarga mencionada en un artículo debe existir bajo `assets/downloads/` o una ruta equivalente publicada.
- Si se adjunta un ZIP de ejemplo, su contenido debe corresponder al ejemplo descrito en el artículo.

## Páginas especiales

### `introduction.html` / `introduction-es.html`

Teoría del curso fuera de la numeración. Usan `layout: article`, no tienen `part`, no viven en `_posts/` y deben mantener `lang_url` cruzado.

### `argo-real-world-microservices.html` / `-es.html`

Landing y temario del curso. El listado de módulos se genera con Liquid a partir de `site.posts`; no duplicar manualmente títulos, descripciones ni `reading_minutes`.

El progreso usa `assets/js/course-progress.js` y la clave `argo-course-progress`, indexada por `post.url`. Cambiar un permalink puede hacer perder el progreso guardado.

### `state-machines-theory-es.html` y páginas teóricas similares

Deben seguir las mismas reglas editoriales y visuales que los posts aunque sean páginas raíz. Si enlazan un ejemplo descargable, el ejemplo debe coincidir exactamente con el caso explicado.

## Revisión de artículos existentes

Cuando se pida revisar o normalizar el blog completo, auditar al menos:

1. front matter obligatorio;
2. patrón de permalink;
3. parejas EN/ES y `lang_url`;
4. `reading_minutes` razonable;
5. `.sheet` de 920px y prosa de 70ch/1.6;
6. texto justificado y responsive;
7. ausencia de viewport/fonts duplicados;
8. headings y un solo `h1`;
9. enlaces internos, externos y anclas;
10. navegación anterior/siguiente;
11. comandos sincronizados con `commands.html`;
12. accesibilidad de imágenes/tablas/controles;
13. coherencia entre texto, diagramas y ejemplos descargables;
14. ortografía, gramática y terminología técnica;
15. funcionamiento conceptual en light/dark y móvil.

Corregir primero errores objetivos y roturas; después normalizar estilo. No rehacer el diseño de un artículo únicamente por preferencia estética si ya cumple estas reglas.

## Criterio de terminado

Un cambio está terminado cuando:

- cumple estas reglas;
- no rompe URLs existentes sin autorización;
- EN/ES quedan sincronizados cuando corresponde;
- enlaces y anclas están comprobados;
- el contenido técnico no se contradice;
- la presentación sigue siendo legible en escritorio y móvil;
- se han actualizado archivos dependientes como `commands.html` cuando procede;
- se ha ejecutado la validación disponible y se indica con claridad cualquier comprobación que solo pueda realizar GitHub Actions.

`AGENTS.md` y `CLAUDE.md` deben mantenerse idénticos. Si se modifica uno, modificar el otro en el mismo cambio.

## Organización de la raíz del repositorio

- `index.html` debe ser el único archivo `.html` ubicado directamente en la raíz del repositorio.
- Las páginas estáticas editoriales que no pertenezcan a `_posts/` deben vivir en `pages/`, conservando sus `permalink` públicos para no romper URLs, SEO, navegación ni progreso guardado.
- No crear nuevas páginas HTML sueltas en la raíz. Antes de añadir una página estática, colocarla en `pages/`.
- Los archivos y directorios técnicos que deban permanecer en la raíz por convención o por funcionamiento de las herramientas —por ejemplo `.github/`, `AGENTS.md`, `CLAUDE.md`, `Gemfile`, `_config.yml`, `_layouts/`, `_posts/` y `assets/`— pueden permanecer allí.
- Esta regla de organización prevalece sobre cualquier referencia anterior de este documento que indique que `introduction*.html`, `argo-real-world-microservices*.html`, `commands.html` o páginas teóricas similares pueden vivir directamente en la raíz.