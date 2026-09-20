# Convenciones del repositorio

## Plataforma

El sitio usa Jekyll y GitHub Pages. Antes de tocar código o contenido, inspecciona la estructura existente, uno o dos artículos recientes del mismo tipo y los layouts relacionados. Reutiliza patrones reales antes de inventar otros nuevos.

## Archivos compartidos

- _layouts/default.html: estructura global, head, canonical, fuentes y metadatos.
- _layouts/article.html: taxonomía y navegación editorial.
- assets/css/theme.css: tema visual global.
- assets/css/article-discovery.css: descubrimiento y navegación entre artículos.
- index.html: catálogo principal, filtros, buscador y carrusel.

Las reglas visuales detalladas viven en presentation.md. Las reglas de descubrimiento viven en content.md.

## Comandos y referencias

Los bloques de terminal deben mostrar comandos exactos. Si un curso introduce un comando nuevo, revisa si también debe añadirse a commands.html.

En commands.html reutiliza entradas equivalentes, añade referencias en vez de duplicar, crea sección/TOC cuando aparezca una herramienta nueva y mantén recuentos y anclas sincronizados.

No modifiques assets/js/commands-filter.js salvo que cambie realmente el comportamiento del buscador.

## Coherencia del cambio

Cuando un cambio afecte post, layout, CSS, JS, índice o recursos compartidos, comprueba todas las referencias relacionadas en el mismo cambio. No cambies convenciones globales del blog por resolver un caso local si los patrones existentes bastan.
