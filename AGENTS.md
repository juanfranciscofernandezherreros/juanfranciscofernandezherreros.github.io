# Reglas del blog para agentes

Estas reglas aplican a todo `juanfranciscofernandezherreros.github.io`. El objetivo no es solo que el sitio funcione: debe sentirse como un blog técnico con personalidad, criterio editorial y artículos que merezca la pena terminar y compartir.

`AGENTS.md` y `CLAUDE.md` deben mantenerse sincronizados. Si se modifica uno, se modifica el otro con el mismo contenido.

El sitio usa Jekyll y GitHub Pages. Antes de tocar código o contenido, revisa la estructura existente, uno o dos artículos recientes y los layouts relacionados. Reutiliza patrones reales del repositorio antes de inventar otros nuevos.

## 1. Norte editorial

Cada publicación debe cumplir al menos una de estas funciones:

- enseñar algo que el lector pueda aplicar;
- explicar con claridad algo que normalmente se explica mal;
- documentar una experiencia real, un fallo, una decisión o una investigación;
- comparar alternativas con criterios concretos;
- construir una idea paso a paso hasta llegar a una conclusión útil.

No publicar contenido de relleno. Si un artículo no aporta una idea, experiencia, explicación, ejemplo o conclusión que justifique su existencia, hay que mejorarlo antes de publicarlo.

El blog debe transmitir experiencia práctica. Preferir ejemplos reales, decisiones, trade-offs, errores, límites y aprendizajes frente a texto genérico que podría aparecer en cualquier documentación.

## 2. Regla de interés: cada artículo necesita una razón para seguir leyendo

Un artículo interesante no es uno lleno de adornos. Es uno que crea una pregunta y la resuelve bien.

Siempre que encaje con el tema, estructurar la pieza alrededor de uno de estos motores narrativos:

- **Problema → investigación → solución → consecuencias.**
- **Hipótesis → experimento → resultado → aprendizaje.**
- **Antes → cambio → después.**
- **Error real → diagnóstico → causa raíz → prevención.**
- **Comparación → criterios → decisión → cuándo elegir otra cosa.**
- **Concepto abstracto → ejemplo concreto → modelo mental reutilizable.**

La introducción debe llegar al problema o promesa principal rápido. Evitar aperturas genéricas como “en el mundo actual…”, “hoy en día…” o definiciones de diccionario que no ayuden al lector.

En las primeras pantallas del artículo debe quedar claro:

1. qué problema o pregunta se va a resolver;
2. por qué importa;
3. qué obtendrá el lector al terminar.

## 3. Voz y estilo

Escribir con tono técnico, directo, curioso y pedagógico. El texto puede tener personalidad, pero nunca debe sacrificar precisión.

- Explica el **porqué**, no solo el **cómo**.
- Usa frases concretas y verbos activos.
- Elimina introducciones largas, repeticiones y conclusiones que solo resumen lo ya dicho.
- Cuando una decisión tenga costes, explícalos.
- Cuando una regla tenga excepciones, menciónalas.
- Cuando algo falle de forma interesante, no ocultes el fallo: úsalo para enseñar.
- No exageres resultados ni uses lenguaje de marketing vacío.
- No inventes comandos ejecutados, benchmarks, errores, capturas, versiones ni resultados.
- Si un dato puede haber cambiado con el tiempo, verifícalo antes de publicarlo.

Preferir ejemplos que parezcan de producción frente a ejemplos artificiales tipo `foo/bar` cuando el dominio permita algo más expresivo.

## 4. Densidad de valor

Cada sección debe justificar su espacio. Antes de añadir un bloque, pregunta: “¿qué entiende o puede hacer el lector después de esto que antes no podía?”.

Un buen artículo alterna de forma natural entre:

- explicación;
- ejemplo;
- evidencia o salida real;
- interpretación;
- siguiente decisión.

No encadenar cinco bloques de código sin explicar qué cambia entre ellos. No insertar diagramas decorativos. No usar tablas cuando tres frases son más claras.

Las listas deben servir para comparar, resumir o ejecutar; no para fragmentar prosa sin motivo.

## 5. Artículos técnicos: estándar mínimo

Todo artículo técnico debe comprobar:

- nombres de herramientas, APIs, clases, métodos y conceptos;
- comandos válidos en el contexto descrito;
- coherencia de rutas, puertos, namespaces, nombres y versiones;
- código compilable o claramente marcado como pseudocódigo;
- transiciones explicadas entre teoría y práctica;
- límites y casos de fallo importantes;
- ausencia de contradicciones entre texto, código, tablas y diagramas.

Cuando el artículo acompaña a un repositorio o ZIP de ejemplo, ambos deben describir el mismo dominio, endpoints, estados y flujo.

Si se muestra una salida de terminal, debe estar claro si es salida real, abreviada o representativa.

## 6. Estructura recomendada de una publicación

No todos los artículos deben usar exactamente la misma plantilla, pero esta secuencia funciona bien como base:

1. **Hook útil:** problema, síntoma, pregunta o resultado llamativo.
2. **Contexto mínimo:** lo necesario para entender el escenario.
3. **Objetivo:** qué se va a demostrar, construir o decidir.
4. **Desarrollo:** pasos o razonamiento con ejemplos verificables.
5. **Momento clave:** descubrimiento, trade-off, fallo o decisión importante.
6. **Resultado:** qué cambió y cómo comprobarlo.
7. **Lecciones:** ideas reutilizables, no un simple resumen.
8. **Siguiente paso:** enlace natural a otro artículo, parte de la serie o experimento.

Los tutoriales largos deben permitir escaneo visual con buenos `h2`, `h3`, código, tablas o callouts cuando aporten valor.

## 7. Series y continuidad

Los artículos de `Argo Real World Microservices` viven en `_posts/` y usan:

```text
/argo-real-world-microservices/part-N/<slug-descriptivo>/
/argo-real-world-microservices/part-N/<slug-descriptivo>/es/
```

Nunca usar `/part-N/` a secas. El slug debe ser el mismo en EN y ES; solo cambia `/es/`.

Nombre de archivo:

```text
_posts/YYYY-MM-DD-part-N-<slug>.html
_posts/YYYY-MM-DD-part-N-<slug>-es.html
```

Cada parte debe funcionar por sí sola y, a la vez, dejar claro qué aporta a la historia global del curso. La navegación anterior/siguiente debe formar una cadena correcta.

Los artículos independientes también viven en `_posts/` y usan una URL temática estable:

```text
/<tema>/<slug>/
/<tema>/<slug>/es/
```

Deben incluir `series` si pertenecen a una familia reconocible de contenidos.

## 8. Bilingüismo

Cuando exista pareja EN/ES:

- mismo slug y estructura conceptual;
- `lang` correcto;
- `lang_url` cruzado y recíproco;
- mismas secciones esenciales, ejemplos, tablas y recursos;
- adaptar el idioma de forma natural, no hacer traducción palabra por palabra;
- no traducir nombres de APIs, comandos o identificadores técnicos que deban conservarse.

Ninguna versión debe sentirse como una copia secundaria de menor calidad.

Si solo existe un idioma por decisión editorial, no crear automáticamente el otro salvo petición explícita.

## 9. Front matter

Todo post debe incluir como mínimo:

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

`lang_url` usa rutas absolutas desde la raíz, no URLs completas con dominio.

`reading_minutes` debe estimarse sobre texto visible real, aproximadamente 200 palabras por minuto, redondeando hacia arriba y con mínimo 3.

No añadir `og_*` o `twitter_*` copiando metadatos sin aportar una variante útil.

## 10. SEO sin escribir para robots

La prioridad es el lector, pero cada artículo debe ser fácil de descubrir y entender desde buscadores y redes.

- Título específico, humano y descriptivo.
- `description` que explique el valor del artículo, no una lista de keywords.
- Un único `h1` visible.
- `h2` y `h3` en orden lógico.
- Permalink corto, descriptivo y estable.
- Categorías y tags útiles; no keyword stuffing.
- Primera parte del artículo comprensible sin contexto externo.
- Enlaces internos hacia piezas relacionadas cuando ayuden de verdad.

No cambiar permalinks existentes salvo petición explícita: pueden romper SEO, enlaces externos y progreso guardado.

## 11. Enlazado interno: convertir artículos en una red

Siempre que exista una relación real, enlazar a contenido previo o posterior del blog. El objetivo es que un buen artículo lleve de forma natural a otro.

Preferir enlaces contextuales del tipo “si quieres entender por qué…” frente a bloques genéricos de “otros posts”.

En una serie, cada artículo debe responder “de dónde venimos” y “qué tiene sentido leer después” sin obligar al lector a volver a la portada. `_layouts/article.html` aporta una ruta de lectura automática para posts de una serie y hasta tres lecturas relacionadas por categoría; no duplicar manualmente ese bloque salvo que el artículo necesite una recomendación contextual distinta.

Toda ancla debe existir y los enlaces EN ↔ ES deben ser recíprocos.

## 12. Diseño visual

El blog debe parecer una publicación coherente, no una colección de micrositios.

Base editorial:

```css
.sheet { max-width: 920px; margin: 48px auto 96px; padding: 0 24px; }
p { max-width: 70ch; line-height: 1.6; text-align: justify; hyphens: auto; -webkit-hyphens: auto; }
```

- Mantener una medida de lectura cómoda.
- No centrar párrafos ni listas explicativas.
- En móvil se puede usar alineación izquierda si mejora legibilidad.
- Mantener jerarquía tipográfica consistente.
- Código y tablas deben funcionar en pantallas pequeñas.
- Hover y focus deben conservar contraste.
- Un artículo puede tener detalles visuales propios, pero no debe romper la identidad global.

Los elementos visuales deben enseñar algo: arquitectura, flujo, estado, comparación, secuencia o relación. Evitar decoración gratuita que distraiga del contenido.

## 13. Accesibilidad

- Imágenes informativas con `alt` útil; decorativas con `alt=""`.
- No depender solo del color para comunicar estados.
- Contraste suficiente en light y dark mode.
- Enlaces y controles con texto comprensible fuera de contexto.
- Diagramas complejos acompañados de explicación textual.
- Tablas con `th` correctos.
- Controles personalizados navegables por teclado y con `:focus-visible`.

## 14. HTML, layouts y CSS heredado

`_layouts/default.html` aporta `<head>`, viewport, fuentes, CSS global, canonical y metadatos sociales. `assets/css/theme.css` es la capa visual global que normaliza la apariencia de artículos antiguos y nuevos. `assets/css/article-discovery.css` contiene la navegación compartida que aparece al final de los artículos.

Por tanto:

- no añadir `<html>`, `<head>` o `<body>` dentro de posts;
- no duplicar viewport ni enlaces de fuentes;
- no introducir selectores globales nuevos dentro de un post (`html`, `body`, `*`, `a`, `p`, `h1`… sin scope);
- el CSS nuevo o modificado de un artículo debe quedar acotado bajo `.sheet` o una clase específica del artículo, por ejemplo `.spring-beans ...`;
- se permiten variables, paletas y componentes visuales propios cuando aporten identidad al artículo y no rompan la capa global;
- los bloques `<style>` heredados pueden mantenerse si el artículo ya funciona y la tarea no requiere refactorizarlos; cuando se toque una regla heredada, aprovechar para acotarla en lugar de ampliar su alcance global;
- preferir HTML semántico: `article`, `section`, `nav`, `figure`, `figcaption`, `table`, `code`, `pre`.

`_layouts/article.html` genera la barra de categorías/subcategorías/tags y la navegación editorial compartida: no duplicarlas manualmente.

## 15. Comandos y referencias

Los bloques de terminal deben mostrar comandos exactos. Si el curso introduce un comando nuevo, revisar si también debe añadirse a `commands.html`.

En `commands.html`:

- reutilizar una entrada existente si el comando y propósito son equivalentes;
- añadir referencias en lugar de duplicar contenido;
- si aparece una herramienta nueva, crear su sección y entrada en el TOC;
- mantener recuentos y anclas sincronizados.

No modificar `assets/js/commands-filter.js` salvo que cambie realmente el comportamiento del buscador.

## 16. Imágenes, diagramas y descargas

- Preferir assets locales con nombres descriptivos.
- Optimizar imágenes demasiado pesadas.
- Una captura de terminal complementa al comando; no lo sustituye.
- Toda descarga mencionada debe existir en una ruta publicada.
- Un ZIP de ejemplo debe coincidir con el artículo que lo describe.

## 17. Flujo obligatorio antes de publicar cambios

Antes de editar:

1. Leer estas reglas.
2. Revisar uno o dos artículos recientes del mismo tipo.
3. Revisar layout, estilos y JS afectados.
4. Comprobar si existe versión EN/ES.
5. Reutilizar taxonomías existentes antes de crear nuevas.

Después de editar:

1. Verificar front matter.
2. Revisar HTML/Liquid y jerarquía de headings.
3. Revisar rutas, enlaces y anclas.
4. Comprobar navegación EN/ES y anterior/siguiente.
5. Revisar responsive, accesibilidad y contraste.
6. Confirmar que ejemplos, comandos y texto cuentan la misma historia.
7. Ejecutar la validación disponible. Si no se ejecutó una build real de Jekyll, no afirmar que “la build pasa”.

## 18. Checklist editorial antes de dar un artículo por terminado

Un artículo está listo cuando se puede responder “sí” a casi todo esto:

- ¿El título promete algo concreto?
- ¿La introducción llega rápido al problema?
- ¿Hay una idea o aprendizaje que merezca ser recordado?
- ¿Se explica por qué ocurre, no solo qué comandos ejecutar?
- ¿Los ejemplos son creíbles y coherentes?
- ¿Se muestran límites, fallos o trade-offs relevantes?
- ¿Cada diagrama, tabla o bloque de código aporta información?
- ¿El lector puede escanear el artículo y entender su estructura?
- ¿Hay enlaces internos útiles?
- ¿La conclusión aporta una decisión, aprendizaje o siguiente paso?
- ¿EN y ES tienen la misma calidad cuando existen ambas versiones?
- ¿El artículo se ve bien en móvil y escritorio?

## 19. Regla final

No optimizar el blog para producir más páginas. Optimizarlo para producir páginas que un desarrollador quiera guardar, compartir o consultar de nuevo.

Cuando haya que elegir entre cantidad y profundidad, elegir profundidad. Cuando haya que elegir entre parecer sofisticado y ser claro, elegir claridad. Cuando haya que elegir entre una explicación genérica y una experiencia concreta, elegir la experiencia concreta.
