# Presentación, accesibilidad y recursos

## Diseño visual

El blog debe parecer una publicación coherente, no una colección de micrositios. Base editorial: .sheet con ancho máximo de 920px y párrafos con medida cómoda, line-height legible y justificación cuando funcione bien.

Mantén jerarquía tipográfica consistente y código/tablas utilizables en móvil. No centres párrafos ni listas explicativas. Hover y focus deben conservar contraste. Los elementos visuales deben enseñar arquitectura, flujo, estado, comparación, secuencia o relación; evita decoración gratuita.

## Accesibilidad

- Imágenes informativas con alt útil; decorativas con alt vacío.
- No dependas solo del color para comunicar estados.
- Contraste suficiente en light y dark mode.
- Enlaces comprensibles fuera de contexto.
- Diagramas complejos acompañados de explicación textual.
- Tablas con th correctos.
- Controles personalizados navegables por teclado y con :focus-visible.

## HTML, layouts y CSS

_layouts/default.html aporta head, viewport, fuentes, CSS global, canonical y metadatos. assets/css/theme.css es la capa visual global. assets/css/article-discovery.css contiene navegación compartida.

No añadas html/head/body dentro de posts, no dupliques viewport o fuentes, no introduzcas selectores globales nuevos sin scope y acota CSS nuevo bajo .sheet o una clase específica del artículo. Prefiere HTML semántico.

_layouts/article.html genera categorías, subcategorías, tags y navegación editorial: no las dupliques manualmente.

## Imágenes, diagramas y descargas

- Prefiere assets locales con nombres descriptivos.
- Optimiza imágenes demasiado pesadas sin destruir legibilidad.
- Una captura de terminal complementa al comando; no lo sustituye.
- Toda descarga mencionada debe existir en una ruta publicada.
- Un ZIP de ejemplo debe coincidir con el artículo.
- No inventes capturas, imágenes, vídeos o resultados que no existan.
