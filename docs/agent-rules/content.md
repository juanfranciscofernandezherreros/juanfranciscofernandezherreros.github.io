# Estructura, bilingüismo y descubrimiento

## Estructura y continuidad

Los artículos viven en `_posts/` y deben usar URLs estables y descriptivas. Conserva los permalinks existentes para no romper enlaces. Para contenido nuevo, prefiere rutas temáticas:

    /<tema>/<slug>/
    /<tema>/<slug>/es/

Cada artículo debe funcionar por sí solo. Los enlaces a otros artículos deben ser contextuales y describir el contenido enlazado, sin depender de numeración editorial.

Incluye `series` solo cuando el artículo pertenezca realmente a una familia editorial reconocible y no necesite numeración para entenderse.

## Bilingüismo

Cuando exista pareja EN/ES: mismo slug y estructura conceptual; lang correcto; lang_url cruzado y recíproco; mismas secciones esenciales, ejemplos, tablas y recursos; adaptación natural del idioma; APIs, comandos e identificadores técnicos sin traducciones incorrectas.

Ninguna versión debe sentirse secundaria. Si solo existe un idioma por decisión editorial, no crees el otro automáticamente salvo petición explícita.

## Front matter

Todo post debe incluir como mínimo: layout, title, description, permalink, lang, lang_url, categories, subcategories, tags, date y reading_minutes. `series` es opcional y solo se usa cuando aporta una agrupación editorial útil.

lang_url usa rutas absolutas desde la raíz. reading_minutes se estima sobre texto visible real a unas 200 palabras/minuto, redondeando hacia arriba y con mínimo 3. No dupliques metadatos og_* o twitter_* sin aportar una variante útil.

## SEO

- Título específico, humano y descriptivo.
- description que explique valor, no una lista de keywords.
- Un único h1 visible y jerarquía h2/h3 lógica.
- Permalink corto, descriptivo y estable.
- Categorías y tags útiles, sin keyword stuffing.
- Primera parte comprensible sin contexto externo.
- Enlaces internos cuando ayuden de verdad.

No cambies permalinks existentes salvo petición explícita.

## Enlazado interno

Cuando exista una relación real, enlaza contenido previo o posterior de forma contextual. _layouts/article.html ya aporta ruta de lectura y lecturas relacionadas; no dupliques manualmente ese bloque salvo una recomendación contextual distinta. Toda ancla debe existir y los enlaces EN ↔ ES deben ser recíprocos.

## Índice y descubrimiento obligatorio

Todo artículo nuevo debe ser descubrible desde el índice principal. Publicar en _posts/ no basta.

index.html construye el catálogo a partir de posts en español y del front matter. Comprueba que `lang` es `es` en la versión española; categories/subcategories/tags permiten encontrarla; título y descripción funcionan en tarjeta/carrusel; `lang_url` enlaza la pareja; y tras una build real la URL aparece en la portada generada.

No des por terminado un artículo que quede huérfano.
